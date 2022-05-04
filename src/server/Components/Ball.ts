import { Component, Janitor } from "@rbxts/knit";
import { Workspace, ServerStorage, CollectionService } from "@rbxts/services";
import { BallConfiguration } from "server/Configurations/BallConfiguration";

class Ball implements Component.ComponentClass {
  // ======================
  // ===== ATTRIBUTES =====
  // ======================

  /**
   * Tag used to reference the object in Knit and the CollectionService
   */
  public static Tag = "Ball";

  /**
   * Base model used to spawn new Balls
   */
  private static BASE_BALL_MODEL: ServerStorage["BallModel"] = ServerStorage.BallModel;

  /**
   * Maximum volume and size that food can be relative to Ball size in order to be eaten
   */
  private static FOOD_VOLUME_CONSTRAINT = 0.5;

  /**
   * Maximum mass that food can be relative to Ball size in order to be eaten
   */
  private static FOOD_MASS_CONSTRAINT = 0.5;

  /**
   * Legal children for the
   */
  private static LEGAL_FOOD_CHILDREN = new Set<string>(["Texture", "Constraint"]);

  private static UNIT_VECTOR: Vector3 = new Vector3(1, 1, 1);

  public Owner: Player;
  public BallJanitor: Janitor = new Janitor();
  public Model: ServerStorage["BallModel"] = Ball.BASE_BALL_MODEL;
  public IsAlive = false;

  private Stats = new BallConfiguration();
  // TODO: Set to Array<Food> once food is implemented
  private FoodQueue = new Array<BasePart>();

  // ==========================
  // ===== PUBLIC METHODS =====
  // ==========================

  constructor(player: Player) {
    // Initialize ball state
    this.Owner = player;
    this.IsAlive = false;
  }

  public Destroy() {
    this.BallJanitor.Destroy();
  }

  public Warp(position: Vector3, adjustForSize = true) {
    // Activate warp welds to fix everything to the model root before moving
    this.Model.WarpWelds.HeadWeld.Enabled = true;
    this.Model.WarpWelds.CoreWeld.Enabled = true;

    // If an adjustment is requested, move the position up to account for
    // the size of the ball
    if (adjustForSize) {
      position = position.add(new Vector3(0, this.Stats.Diameter / 2, 0));
    }

    // Move to location
    this.Model.SetPrimaryPartCFrame(new CFrame(position));

    // Deactivate warp welds to fix everything to the model root after moving
    this.Model.WarpWelds.HeadWeld.Enabled = false;
    this.Model.WarpWelds.CoreWeld.Enabled = false;
  }

  public Kill() {
    this.Model.Humanoid.TakeDamage(100);
    this.IsAlive = false;
  }

  public Spawn(position: Vector3 | undefined = undefined, forceRespawn = false) {
    // Return if the player is already alive
    if (this.IsAlive) {
      if (forceRespawn) {
        this.Kill();
      } else {
        return;
      }
    }

    // If a position was not provided, set to either the player's respawn location
    // or to the world origin with a warning.
    if (!position) {
      if (this.Owner.RespawnLocation) {
        position = this.Owner.RespawnLocation!.Position;
      } else {
        print(
          `[WARN] ${this.Owner.Name} did not have a valid respawn location and was spawned to origin.`,
        );
        position = new Vector3();
      }
    }

    // Create new model
    this.Model = Ball.BASE_BALL_MODEL.Clone();
    this.AttachFunctionsToBallModel();

    // Initialize new stats
    this.Stats = new BallConfiguration();
    this.Update();

    // this.Warp(position!);

    this.Model.Name = this.Owner.Name;
    this.Model.Parent = Workspace;

    // Swap out & destroy previous character
    const previousCharacter: Model | undefined = this.Owner.Character;
    this.Owner.Character = this.Model;
    previousCharacter?.Destroy();

    // Set player to alive
    this.IsAlive = true;
  }

  // ===========================
  // ===== PRIVATE METHODS =====
  // ===========================

  private static CleanFood(part: BasePart) {
    // Break any joints the part may have
    part.Anchored = false;
    part.BreakJoints();
    part.CanCollide = false;

    for (const child of part.GetChildren()) {
      if (!Ball.LEGAL_FOOD_CHILDREN.has(child.ClassName)) {
        child.Destroy();
      }
    }
  }

  private AttachFunctionsToBallModel() {
    this.Model.Head.Touched.Connect((otherPart: BasePart) => this.Eat(otherPart));
    this.Model.Humanoid.Died.Connect(() => this.Kill());
  }

  private Update(): BallConfiguration {
    // Update top speed based on mass
    this.Stats.TopSpeed = this.Stats.Mass * this.Stats.TopSpeedMultiplier;

    // Update diameter from volume
    this.Stats.Diameter = 2 * math.pow((3 * this.Stats.Volume) / (4 * math.pi), 1 / 3);

    // Update density from volume and mass
    this.Stats.Density = this.Stats.Mass / this.Stats.Volume;

    // Update Core Size
    this.Model.Core.Size = Ball.UNIT_VECTOR.mul(this.Stats.Diameter);

    // Update Root Size
    this.Model.HumanoidRootPart.Size = Ball.UNIT_VECTOR.mul(this.Stats.RootRatio).mul(
      this.Stats.Diameter,
    );

    // Update Membrane Size
    this.Model.Head.Size = Ball.UNIT_VECTOR.mul(this.Stats.MembraneRatio).mul(this.Stats.Diameter);

    this.Model.Core.CustomPhysicalProperties = new PhysicalProperties(
      this.Stats.Density,
      this.Stats.Friction,
      this.Stats.Elasticity,
      this.Stats.FrictionWeight,
      this.Stats.ElasticityWeight,
    );

    this.Model.Humanoid.WalkSpeed = math.clamp(
      this.Stats.TopSpeed,
      BallConfiguration.TOP_SPEED_MIN,
      BallConfiguration.TOP_SPEED_MAX,
    );

    return this.Stats;
  }

  private Excrete() {
    // TODO: Excrete excess mass
  }

  private Digest(part: BasePart) {
    // Update stats
    this.Stats.Volume += part.Mass / part.CustomPhysicalProperties.Density;
    this.Stats.Mass += part.Mass;

    // Destroy part & weld
    part.Destroy();

    if (part.Parent?.GetChildren().isEmpty()) {
      part.Parent.Destroy();
    }
  }

  private Eat(part: BasePart) {
    // Don't eat if the part isn't eatable
    if (!this.IsEatable(part)) {
      return;
    }

    // Clean the food
    Ball.CleanFood(part);

    // Create new weld constraint for the new part
    const weld = new Instance("WeldConstraint");
    weld.Parent = this.Model.FoodWelds;
    weld.Part0 = this.Model.Head;
    weld.Part1 = part;

    // Attach eaten part to membrane
    part.Parent = this.Model.Food;
    part.Position = this.Model.Head.Position.add(
      part.Position.sub(this.Model.Head.Position).Unit.mul(this.Model.Head.Size.X / 2),
    );

    wait(this.Stats.DigestionTime);

    this.Digest(part);

    weld.Destroy();

    this.Update();
  }

  private IsEatable(part: BasePart) {
    const isEatable = CollectionService.HasTag(part, "Edible");

    // Short-circuit return if the prereqs aren't met
    if (!isEatable) {
      return false;
    }

    const partVolume = part.Mass / part.CustomPhysicalProperties.Density;
    const partMaxSize = math.max(part.Size.X, part.Size.Y, part.Size.Z);

    return (
      this.Stats.Volume * this.Stats.MembraneRatio * Ball.FOOD_VOLUME_CONSTRAINT > partVolume &&
      this.Stats.Diameter * this.Stats.MembraneRatio * Ball.FOOD_VOLUME_CONSTRAINT > partMaxSize &&
      this.Stats.Mass > part.Mass * Ball.FOOD_MASS_CONSTRAINT
    );
  }
}

export = Ball;
