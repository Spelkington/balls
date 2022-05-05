class BallConfiguration {
  private static UNIT_VECTOR = new Vector3(1, 1, 1);

  public static DEFAULT_RESPAWN_LOCATION = new Vector3(0, 100, 0);
  public static FOOD_SIZE_CONSTRAINT = 5;
  public static FOOD_MASS_CONSTRAINT = 0.5;
  public static LEGAL_FOOD_CHILDREN = new Set<string>([
    "Texture",
    "Constraint",
    "SpecialMesh",
  ]);

  // =========================
  // ===== Global Limits =====
  // =========================
  public static TOP_SPEED_MIN = 16; // studs per second
  public static TOP_SPEED_MAX = 10_000; // studs per second
  public static DIAMETER_MIN = 0.5;
  public static DIAMETER_MAX = 250;
  public static ROOT_RATIO = 0.5;
  public static HEAD_RATIO = 0.85;
  public static RESPAWN_TIME = 3;
  public static STATS_UPDATE_DEBOUNCE = 5;

  // =========================
  // ===== Initial Stats =====
  // =========================
  public static INITIAL_CORE_SIZE = 2;
  public static INITIAL_DENSITY = 0.25;
  public static INITIAL_MEMBRANE_RATIO = 1.5;
  public static INITIAL_TOP_SPEED_MULT = 0.2; // studs per second per gram
  public static INITIAL_FRICTION = 5;
  public static INITIAL_ELASTICITY = 1;
  public static INITIAL_FRICTION_WEIGHT = 5;
  public static INITIAL_ELASTICITY_WEIGHT = 1;
  public static INITIAL_DIGESTION_TIME = 3;

  // ===============================
  // ===== Physical Properties =====
  // ===============================
  public Diameter: number;
  public CoreDiameter: number = BallConfiguration.INITIAL_CORE_SIZE;
  public MembraneDiameter: number;
  public Density: number = BallConfiguration.INITIAL_DENSITY;
  public Friction: number = BallConfiguration.INITIAL_FRICTION;
  public Elasticity: number = BallConfiguration.INITIAL_ELASTICITY;
  public FrictionWeight: number = BallConfiguration.INITIAL_FRICTION_WEIGHT;
  public ElasticityWeight: number = BallConfiguration.INITIAL_ELASTICITY_WEIGHT;
  public TopSpeedMultiplier: number = BallConfiguration.INITIAL_TOP_SPEED_MULT;
  public Volume;
  public CoreVolume;
  public MembraneVolume;
  public Mass;
  public TopSpeed;

  // =============================
  // ===== Model Size Ratios =====
  // =============================
  public DigestionTime: number = BallConfiguration.INITIAL_DIGESTION_TIME;

  constructor() {
    this.MembraneDiameter =
      this.CoreDiameter * BallConfiguration.INITIAL_MEMBRANE_RATIO;
    this.Diameter = this.CoreDiameter + this.MembraneDiameter;

    this.CoreVolume = (4 / 3) * math.pi * math.pow(this.CoreDiameter / 2, 3);
    this.MembraneVolume =
      (4 / 3) * math.pi * math.pow(this.MembraneDiameter / 2, 3) -
      this.CoreVolume;
    this.Volume = this.CoreVolume + this.MembraneVolume;

    this.Mass = this.Density * this.Volume;
    this.TopSpeed = this.Mass * this.TopSpeedMultiplier;
  }
}

export { BallConfiguration };
