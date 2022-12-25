import { Test, TestingModule } from "@nestjs/testing";
import { OverviewController } from "./overview.controller";
import { OverviewService } from "./overview.service";

describe("ChangeLogService", () => {
  let changeLogService: OverviewService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [OverviewController],
      providers: [OverviewService],
    }).compile();

    changeLogService = app.get<OverviewService>(OverviewService);
  });

  describe("change log service", () => {
    it('should return "Hello World!"', () => {
      expect(changeLogService.parseOverview("Hello World!")).toBe([
        {
          markdown: "Hello World!",
        },
      ]);
    });
  });
});
