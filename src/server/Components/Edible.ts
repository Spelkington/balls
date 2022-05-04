import { Component, Janitor } from "@rbxts/knit";
import { EdibleMaterialConfiguration } from "server/Configurations/EdibleMaterialConfiguration";

class Edible implements Component.ComponentClass {
  public static Tag = "Edible";
  private janitor = new Janitor();

  constructor(instance: Instance) {
    assert(instance.IsA("BasePart"));
    instance.CustomPhysicalProperties = EdibleMaterialConfiguration.get(instance.Material.Name)!;
    print("Edible configured");
  }

  public Destroy() {
    this.janitor.Destroy();
  }
}

export = Edible;
