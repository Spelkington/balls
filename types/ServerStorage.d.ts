interface ServerStorage extends Instance {
  BallModel: Model & {
    Membrane: Part & {
      MembraneAttachment: Attachment;
    };
    Humanoid: Humanoid;
    BodyAlignments: Folder & {
      AlignMembrane: AlignPosition;
      AlignHead: AlignPosition;
      AlignMembraneOrientation: AlignOrientation;
    };
    Head: Part & {
      HeadAttachment: Attachment;
    };
    WarpWelds: Folder & {
      HeadWeld: WeldConstraint;
      MembraneWeld: WeldConstraint;
    };
    Food: Model;
    HumanoidRootPart: Part & {
      RootAttachment: Attachment;
    };
    FoodWelds: Folder;
  };
  TagList: Folder & {
    Edible: Configuration;
    Ball: Configuration;
  };
}
