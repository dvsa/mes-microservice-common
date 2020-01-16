const MANUAL: string = 'Manual';
const AUTOMATIC: string = 'Automatic';

export function licenceToIssue(
    category: string,
    vehicleTransmission: string,
    code78Present?: boolean): string {

  const categoriesToCheck: string[] = ['C', 'D', 'C+E', 'D+E'];

  if (code78Present === undefined) {
    return vehicleTransmission;
  }

  if (categoriesToCheck.findIndex(cat => cat === category) !== -1 &&
  vehicleTransmission === AUTOMATIC && !code78Present) {
    return MANUAL;
  }

  return vehicleTransmission;
}
