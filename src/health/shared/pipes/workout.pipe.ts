import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "workout"
})
export class WorkoutPipePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value.type === "endurance") {
      return `Distance: ${value.endurance.distance + "km"}, Duration: ${value
        .endurance.duration + "mins"}`;
    } else {
      return `
      Weight: ${value.strength.weight + "kg"},
      Reps: ${value.strength.reps},
      Sets: ${value.strength.sets}
      `;
    }
  }
}
