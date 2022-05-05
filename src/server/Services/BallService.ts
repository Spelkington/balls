import {
  KnitServer as Knit,
  Signal,
  RemoteProperty,
  RemoteSignal,
} from "@rbxts/knit";
import { Player } from "@rbxts/knit/Knit/KnitClient";
import { Players, ServerStorage } from "@rbxts/services";
import Ball from "server/Components/Ball";
import { BallConfiguration } from "shared/Configurations/BallConfiguration";

declare global {
  interface KnitServices {
    BallService: typeof BallService;
  }
}

const BallService = Knit.CreateService({
  Name: "BallService",

  // Server-exposed signals/fields:
  Balls: new Map<Player, Ball>(),
  BallSpawned: new Signal<(player: Player) => void>(),
  BallKilled: new Signal<(player: Player) => void>(),
  BallUpdated: new Signal<(player: Player, stats: BallConfiguration) => void>(),

  Client: {
    // Client exposed signals:
    BallSpawned: new RemoteSignal<(ball: ServerStorage["BallModel"]) => void>(),
    BallUpdated: new RemoteSignal<(stats: BallConfiguration) => void>(),

    // Client exposed properties:
    // MostScore: new RemoteProperty(0),
    // Client exposed GetScore method:
    // GetScore(player: Player): number {
    //   return this.Server.GetScore(player);
    // },
  },

  GetBall(player: Player): Ball | undefined {
    return this.Balls.get(player);
  },

  SpawnBall(player: Player, location: Vector3 | undefined = undefined) {
    const ball = this.GetBall(player);
    ball?.Spawn(location);
  },

  // Initialize
  KnitInit() {
    Players.PlayerAdded.Connect((player: Player) => {
      const newBall = new Ball(player);
      this.Balls.set(player, new Ball(player));
      this.SpawnBall(player);
    });

    this.BallSpawned.Connect((player: Player) => {
      const ball = this.GetBall(player)!;

      // Monitor ball for death
      ball.Model.Humanoid.Died.Connect(() => {
        wait(BallConfiguration.RESPAWN_TIME);
        this.SpawnBall(player);
      });

      this.Client.BallSpawned.Fire(player, ball.Model);
    });

    this.BallUpdated.Connect((player: Player, stats: BallConfiguration) => {
      this.Client.BallUpdated.Fire(player, stats);
    });
  },
});

export = BallService;
