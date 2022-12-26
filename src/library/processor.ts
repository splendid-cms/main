import { Logger, Injectable } from "@nestjs/common";

interface ExitHandlerOptions {
  cleanup?: boolean;
  exit?: boolean;
}

type ExitHandler = (
  options: ExitHandlerOptions,
  exitCode: number | string,
) => void;

@Injectable()
export class ProcessorService {
  public process: NodeJS.Process = process;
  private readonly logger: Logger = new Logger(ProcessorService.name);

  constructor() {
    // Don't terminate the process instantly
    this.process.stdin.resume();

    // TODO: Add graceful shutdown
    // The ones below won't work
    // due to the fact that NestJS
    // doesn't export a logger
    // so in order to finish
    // & uncomment that you need
    // @splendid-cms/logr module done

    // Do something when app is closing
    // this.binder("exit", { cleanup: true });

    // Catches Ctrl+C event
    // this.binder("SIGINT", { exit: true });

    // Catches "kill pid" (for example: nodemon restart)
    // this.binder(["SIGUSR1", "SIGUSR2"], { exit: true });

    // Catches uncaught exceptions & unhandled promise rejections
    // For example, if you have a promise that doesn't have a catch block
    // this.binder(["uncaughtException", "unhandledRejection"], { exit: true });
  }

  public exitHandler<ExitHandler>(
    options: ExitHandlerOptions,
    exitCode: number | string,
  ): void {
    if (exitCode || exitCode === 0)
      this.logger.log("Terminating process with code: " + exitCode);
    options.cleanup && this.logger.log("Gracefully shutting down!");
    options.exit && process.exit();
  };

  public binder(
    event: string | string[],
    options: ExitHandlerOptions,
    handler: ExitHandler = this.exitHandler
  ): void {
    if (typeof event === "string") event = [event];
    event.forEach((e) => {
      process.on(e, handler.bind(null, options));
    });
  }
}