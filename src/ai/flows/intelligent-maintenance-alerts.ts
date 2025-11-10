'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating intelligent vehicle maintenance alerts.
 *
 * - generateMaintenanceAlert - A function that generates a maintenance alert based on vehicle data and maintenance configuration.
 * - MaintenanceAlertInput - The input type for the generateMaintenanceAlert function.
 * - MaintenanceAlertOutput - The return type for the generateMaintenanceAlert function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MaintenanceAlertInputSchema = z.object({
  vehicleName: z.string().describe('The name of the vehicle.'),
  currentOdometer: z.number().describe('The current odometer reading of the vehicle in kilometers.'),
  nextMaintenanceKm: z.number().describe('The odometer reading in kilometers when the next maintenance is due.'),
});
export type MaintenanceAlertInput = z.infer<typeof MaintenanceAlertInputSchema>;

const MaintenanceAlertOutputSchema = z.object({
  alertMessage: z.string().describe('The generated maintenance alert message.'),
});
export type MaintenanceAlertOutput = z.infer<typeof MaintenanceAlertOutputSchema>;

export async function generateMaintenanceAlert(input: MaintenanceAlertInput): Promise<MaintenanceAlertOutput> {
  return maintenanceAlertFlow(input);
}

const maintenanceAlertPrompt = ai.definePrompt({
  name: 'maintenanceAlertPrompt',
  input: {schema: MaintenanceAlertInputSchema},
  output: {schema: MaintenanceAlertOutputSchema},
  prompt: `You are an expert vehicle maintenance advisor.
  Your task is to generate a friendly and informative maintenance alert message for a vehicle owner.
  Use the provided vehicle name, current odometer reading, and next maintenance kilometer reading to create the alert.

  Vehicle Name: {{{vehicleName}}}
  Current Odometer: {{{currentOdometer}}} km
  Next Maintenance Km: {{{nextMaintenanceKm}}} km

  Alert Message:`,
});

const maintenanceAlertFlow = ai.defineFlow(
  {
    name: 'maintenanceAlertFlow',
    inputSchema: MaintenanceAlertInputSchema,
    outputSchema: MaintenanceAlertOutputSchema,
  },
  async input => {
    const {output} = await maintenanceAlertPrompt(input);
    return output!;
  }
);
