import type { z } from "zod";
import type {
  peopleFiltersSchema,
  personFormSchema,
  personSchema,
} from "../schemas/person.schema";

export type Person = z.infer<typeof personSchema>;
export type PersonFormValues = z.infer<typeof personFormSchema>;
export type PeopleFilters = z.infer<typeof peopleFiltersSchema>;
export type PersonStatus = Person["status"];
