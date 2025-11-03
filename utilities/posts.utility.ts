export function toISTTimestamp(dateInput: string, timeInput: string) {
    return `${dateInput}T${timeInput}:00+05:30`;
}
