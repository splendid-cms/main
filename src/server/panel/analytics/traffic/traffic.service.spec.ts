import { Test, TestingModule } from "@nestjs/testing";
import { TrafficController } from "./traffic.controller";
import { TrafficService } from "./traffic.service";

describe("ChangeLogService", () => {
  let trafficService: TrafficService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [TrafficController],
      providers: [TrafficService],
    }).compile();

    trafficService = app.get<TrafficService>(TrafficService);
  });

  // describe("change log service", () => {
  //   it('should return "Hello World!"', () => {
  //     expect(
  //       changeLogService.parseChangeLog([
  //         {
  //           name: "Hello World!",
  //           version: "1.0.0",
  //           randomProp: "Hello World!",
  //           body: "Hello World!",
  //         },
  //       ])
  //     ).toBe([
  //       {
  //         name: "Hello World!",
  //         body: "Hello World!",
  //       },
  //     ]);
  //   });
  // });
});
