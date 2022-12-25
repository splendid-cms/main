import { Test, TestingModule } from "@nestjs/testing";
import { ChangeLogController } from "./change-log.controller";
import { ChangeLogService } from "./change-log.service";

describe("ChangeLogService", () => {
  let changeLogService: ChangeLogService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ChangeLogController],
      providers: [ChangeLogService],
    }).compile();

    changeLogService = app.get<ChangeLogService>(ChangeLogService);
  });

  describe("change log service", () => {
    it('should return "Hello World!"', () => {
      expect(
        changeLogService.parseChangeLog([
          {
            name: "Hello World!",
            version: "1.0.0",
            randomProp: "Hello World!",
            body: "Hello World!",
          },
        ])
      ).toBe([
        {
          name: "Hello World!",
          body: "Hello World!",
        },
      ]);
    });
  });
});
