import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

const MANUAL: string = 'Manual';
const AUTOMATIC: string = 'Automatic';

export function licenceToIssue(
  category: string,
  vehicleTransmission: string,
  code78Present?: boolean): string {

  const categoriesToCheck: string[] = [
    TestCategory.C,
    TestCategory.CE,
    TestCategory.C1,
    TestCategory.C1E,
    TestCategory.D,
    TestCategory.DE,
    TestCategory.D1,
    TestCategory.D1E,
  ];

  if (code78Present === undefined) {
    return vehicleTransmission;
  }

  if (categoriesToCheck.findIndex(cat => cat === category) !== -1 &&
  vehicleTransmission === AUTOMATIC && !code78Present) {
    return MANUAL;
  }

  return vehicleTransmission;
}
