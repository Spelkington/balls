import { Workspace, ServerScriptService, Players } from "@rbxts/services";
import { KnitServer as Knit, Component } from "@rbxts/knit";
import Ball from "server/Components/Ball";

Knit.AddServices(ServerScriptService.TS.Services);
Knit.Start();
Component.Auto(ServerScriptService.TS.Components);

Players.CharacterAutoLoads = false;
