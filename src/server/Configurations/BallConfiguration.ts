class BallConfiguration {
  // =========================
  // ===== Global Limits =====
  // =========================
  public static TOP_SPEED_MIN: number = 16; // studs per second
  public static TOP_SPEED_MAX: number = 10_000; // studs per second
  public static DIAMETER_MIN: number = 0.5;
  public static DIAMETER_MAX: number = 250;

  // =========================
  // ===== Initial Stats =====
  // =========================
  public static INITIAL_SIZE: number = 1;
  public static INITIAL_DENSITY: number = 1;
  public static INITIAL_ROOT_RATIO: number = 0.5;
  public static INITIAL_MEMBRANE_RATIO: number = 1.5;
  public static INITIAL_TOP_SPEED_MULTIPLIER: number = 0.125; // studs per second per gram
  public static INITIAL_FRICTION = 1;
  public static INITIAL_ELASTICITY = 1;
  public static INITIAL_FRICTION_WEIGHT = 1;
  public static INITIAL_ELASTICITY_WEIGHT = 1;
  public static INITIAL_DIGESTION_TIME = 10;

  // ===================================
  // ===== Set Physical Properties =====
  // ===================================
  public Diameter: number = BallConfiguration.INITIAL_SIZE;
  public Density: number = BallConfiguration.INITIAL_DENSITY;
  public Friction: number = BallConfiguration.INITIAL_FRICTION;
  public Elasticity: number = BallConfiguration.INITIAL_ELASTICITY;
  public FrictionWeight: number = BallConfiguration.INITIAL_FRICTION_WEIGHT;
  public ElasticityWeight: number = BallConfiguration.INITIAL_ELASTICITY_WEIGHT;
  public TopSpeedMultiplier: number = BallConfiguration.INITIAL_TOP_SPEED_MULTIPLIER;

  // ==================================================
  // ===== Internally-Derived Physical Properties =====
  // ==================================================
  public Volume;
  public Mass;
  public TopSpeed;

  // =============================
  // ===== Model Size Ratios =====
  // =============================
  public RootRatio: number = BallConfiguration.INITIAL_ROOT_RATIO;
  public MembraneRatio: number = BallConfiguration.INITIAL_MEMBRANE_RATIO;

  // =============================
  // ===== Model Size Ratios =====
  // =============================
  public DigestionTime: number = BallConfiguration.INITIAL_DIGESTION_TIME;

  constructor() {
    this.Volume = (4 / 3) * math.pi * math.pow(this.Diameter / 2, 3);
    this.Mass = this.Density * this.Volume;
    this.TopSpeed = this.Mass * this.TopSpeedMultiplier;
  }
}

export { BallConfiguration };
