import {TestCategory} from '@dvsa/mes-test-schema/category-definitions/common/test-category';

/**
 * DL25 test category to test type mapping, as per the TARS TEST_CATEGORY_CROSS_REFERENCE table,
 * @param {string} category
 * @return {number | undefined}
 */
export function determineDl25TestType(category: string): number | undefined {
  // documented at https://wiki.i-env.net/display/MES/Test+Category+Cross+Reference and agreed with DVSA MI Team.
  const mapping: Map<TestCategory, number> = new Map([
    [TestCategory.ADI2, 10],
    [TestCategory.ADI3, 11],
    [TestCategory.B, 2], [TestCategory.BE, 2],
    [TestCategory.C, 3], [TestCategory.CE, 3], [TestCategory.C1, 3], [TestCategory.C1E, 3],
    [TestCategory.D, 4], [TestCategory.DE, 4], [TestCategory.D1, 4], [TestCategory.D1E, 4],
    [TestCategory.F, 5],
    [TestCategory.G, 6],
    [TestCategory.H, 7],
    [TestCategory.K, 8],
    [TestCategory.EUA1M1, 16], [TestCategory.EUA1M2, 1],
    [TestCategory.EUA2M1, 16], [TestCategory.EUA2M2, 1],
    [TestCategory.EUAM1, 16], [TestCategory.EUAM2, 1],
    [TestCategory.EUAMM1, 17], [TestCategory.EUAMM2, 9],
    [TestCategory.CCPC, 44], [TestCategory.DCPC, 44],
    [TestCategory.CM, 18], [TestCategory.CEM, 18], [TestCategory.C1M, 18], [TestCategory.C1EM, 18],
    [TestCategory.DM, 19], [TestCategory.DEM, 19], [TestCategory.D1M, 19], [TestCategory.D1EM, 19],
    [TestCategory.SC, 12],
  ]);
  return mapping.get(category as TestCategory);
}
