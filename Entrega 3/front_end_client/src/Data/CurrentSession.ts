import { LoggedUser } from "./LoggedUser"

export type CurrentSession = {
    id: string,
    user: LoggedUser
}