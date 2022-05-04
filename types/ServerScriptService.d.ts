interface ServerScriptService extends Instance {
  TS: Folder & {
    main: Script;
    Components: Folder & {
      Edible: ModuleScript;
      Ball: ModuleScript;
    };
    Configurations: Folder & {
      BallConfiguration: ModuleScript;
      EdibleMaterialConfiguration: ModuleScript;
    };
    Services: Folder;
  };
}
