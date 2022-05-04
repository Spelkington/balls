interface ServerStorage extends Instance {
	TagList: Folder & {
		Edible: Configuration;
		Ball: Configuration;
	};
	BallModel: Model & {
		Core: Part & {
			CoreAttachment: Attachment;
		};
		FoodWelds: Folder;
		BodyAlignments: Folder & {
			AlignCore: AlignPosition;
			AlignHead: AlignPosition;
			AlignHeadOrientation: AlignOrientation;
		};
		Food: Model;
		WarpWelds: Folder & {
			HeadWeld: WeldConstraint;
			CoreWeld: WeldConstraint;
		};
		Head: Part & {
			HeadAttachment: Attachment;
		};
		HumanoidRootPart: Part & {
			RootAttachment: Attachment;
		};
		Humanoid: Humanoid;
	};
}
