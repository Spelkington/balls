import { Component, Janitor } from "@rbxts/knit";
import { EdibleMaterialConfiguration } from "shared/Configurations/EdibleMaterialConfiguration";

class SolidFood implements Component.ComponentClass {
  public static Tag = "SolidFood";
  private janitor = new Janitor();

  constructor(instance: Instance) {
    assert(instance.IsA("BasePart"));
    instance.CustomPhysicalProperties = EdibleMaterialConfiguration.get(
      instance.Material.Name,
    )!;
    print("Edible configured");
  }

  public Destroy() {
    this.janitor.Destroy();
  }
}

export = SolidFood;
