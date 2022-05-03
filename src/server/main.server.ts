import { Workspace, ServerScriptService, Players } from "@rbxts/services";
import { KnitServer as Knit, Component } from "@rbxts/knit";
import Ball from "server/Components/Ball";

Knit.Start();
// Knit.AddServices(ServerScriptService.TS.Services);
Component.Auto(ServerScriptService.TS.Components);

// TODO: Set ball maintenance to service
let PlayerBalls = new Map<Player, Ball>();

Players.PlayerAdded.Connect((player: Player) => {

    PlayerBalls.set(player, new Ball(player));
    player.RespawnLocation = <SpawnLocation>Workspace.FindFirstChild("SpawnLocation");

    player.CharacterAdded.Connect((character: Model) => {
        PlayerBalls.get(player)?.Spawn(new Vector3(0, 100, 0));
        // TODO: Find a way to remove this :)
        Players.CharacterAutoLoads = false;
    })
        
    while (true) {
        wait(5)
        print(`Velocity: ${PlayerBalls.get(player)?.Model.Head.AssemblyLinearVelocity.Magnitude}`)
    }
})