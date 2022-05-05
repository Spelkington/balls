import { KnitClient as Knit } from "@rbxts/knit";
import { Players, Workspace, ServerStorage } from "@rbxts/services";
import { BallConfiguration } from "shared/Configurations/BallConfiguration";

Knit.Start();

const LOCAL_PLAYER = Players.LocalPlayer;
const LOCAL_CAMERA = Workspace.CurrentCamera;
const SMOOTH_CAMERA_FRAMES = BallConfiguration.STATS_UPDATE_DEBOUNCE / 60;
const BallService = Knit.GetService("BallService");

BallService.BallSpawned.Connect((ballModel: ServerStorage["BallModel"]) => {
  LOCAL_CAMERA!.CameraSubject = ballModel.Head;

  const cameraDistance =
    BallConfiguration.INITIAL_CORE_SIZE *
    BallConfiguration.INITIAL_MEMBRANE_RATIO *
    2;
  LOCAL_PLAYER.CameraMinZoomDistance = cameraDistance;
  LOCAL_PLAYER.CameraMaxZoomDistance = cameraDistance;
});

BallService.BallUpdated.Connect((stats: BallConfiguration) => {
  if (!LOCAL_CAMERA || !LOCAL_CAMERA.CameraSubject) {
    return;
  }

  // TODO: Find actual number
  const cameraSubject: Part = <Part>LOCAL_CAMERA?.CameraSubject;
  const targetDistance = 2 * stats.Diameter;
  const currentDistance = LOCAL_CAMERA?.CFrame.Position.sub(
    cameraSubject.Position,
  ).Magnitude;

  assert(currentDistance !== targetDistance);

  const distanceIncrement =
    (targetDistance - currentDistance!) / SMOOTH_CAMERA_FRAMES;

  // TODO: Smooth Zoom
  LOCAL_PLAYER.CameraMinZoomDistance = targetDistance;
  LOCAL_PLAYER.CameraMaxZoomDistance = targetDistance;
  print(`Camera distance set to ${targetDistance}`);
});
