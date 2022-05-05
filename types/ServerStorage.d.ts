interface ServerStorage extends Instance {
	TagList: Folder & {
		Edible: Configuration;
		Ball: Configuration;
	};
	BallModel: Model & {
		Membrane: Part & {
			MembraneAttachment: Attachment;
		};
		Humanoid: Humanoid;
		BodyAlignments: Folder & {
			AlignMembrane: AlignPosition;
			AlignHeadOrientation: AlignOrientation;
			AlignMembraneOrientation: AlignOrientation;
			AlignHead: AlignPosition;
			AlignCore: AlignPosition;
		};
		Food: Model;
		HumanoidRootPart: Part & {
			RootAttachment: Attachment;
		};
		Core: Part & {
			CoreAttachment: Attachment;
		};
		Head: Part & {
			HeadAttachment: Attachment;
		};
		FoodWelds: Folder;
		WarpWelds: Folder & {
			CoreWeld: WeldConstraint;
			HeadWeld: WeldConstraint;
			MembraneWeld: WeldConstraint;
		};
	};
}
