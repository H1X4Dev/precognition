import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"

export type StatusHandler = (response: AxiosResponse, axiosError?: AxiosError) => unknown

export type ValidationHandler = (errors: ValidationErrors, axiosError: AxiosError) => unknown

export interface ValidationPayload {
    message: string,
    errors: ValidationErrors,
}

export interface ValidationErrors {
    [key: string]: Array<string>,
}

export type Config = AxiosRequestConfig&{
    validate?: Iterable<string>|ArrayLike<string>,
    onPrecognitionSuccess?: StatusHandler,
    onValidationError?: ValidationHandler,
    onUnauthorized?: StatusHandler,
    onForbidden?: StatusHandler,
    onNotFound?: StatusHandler,
    onConflict?: StatusHandler,
    onLocked?: StatusHandler,
    fingerprint?: string|null,
}

export type RequestFingerprintResolver = (config: Config, axios: AxiosInstance) => string|null

export interface Client {
    get(url: string, config: Config): Promise<unknown>,
    post(url: string, data: unknown, config: Config): Promise<unknown>,
    patch(url: string, data: unknown, config: Config): Promise<unknown>,
    put(url: string, data: unknown, config: Config): Promise<unknown>,
    delete(url: string, config: Config): Promise<unknown>,
    validate(callback: ClientCallback): Validator,
    poll(callback: ClientCallback): Poll,
    use(axios: AxiosInstance): Client,
    fingerprintRequestsUsing(callback: RequestFingerprintResolver|null): Client,
}

export interface Validator {
    changed(): Set<string>,
    debounce(duration: Timeout): Validator,
    validate(input: string, value: unknown): Validator,
    validating(): boolean,
}

export interface Timeout {
    milliseconds?: number,
    seconds?: number,
    minutes?: number,
    hours?: number,
}

export interface Poll {
    start(): Poll,
    stop(): Poll,
    every(timeout: Timeout): Poll,
    polling(): boolean,
    invocations(): number
}

export type ClientCallback = (client: Pick<Client, 'get'|'post'|'patch'|'put'|'delete'>) => Promise<unknown>
