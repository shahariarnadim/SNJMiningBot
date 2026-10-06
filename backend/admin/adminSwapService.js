import swapService from "../modules/swaps/swapService.js";


/*
 * Get current swap settings.
 */
const getSwapSettings = async () => {
  return swapService.getSwapSettings();
};


/*
 * Get all supported swap pairs.
 */
const getSwapPairs = async () => {
  return swapService.getSwapPairs();
};


/*
 * Get a specific swap pair.
 */
const getSwapPairById = async (
  pairId
) => {
  if (!pairId) {
    throw new Error(
      "Swap pair ID is required."
    );
  }

  const pair =
    await swapService.getSwapPairById(
      pairId
    );

  if (!pair) {
    throw new Error(
      "Swap pair not found."
    );
  }

  return pair;
};


/*
 * Update swap settings.
 *
 * Admin can control:
 * - swap enabled/disabled
 * - exchange rate
 * - minimum swap amount
 */
const updateSwapSettings = async (
  values = {}
) => {
  if (
    !values ||
    typeof values !== "object" ||
    Array.isArray(values)
  ) {
    throw new Error(
      "Swap settings must be an object."
    );
  }

  const allowedFields = [
    "enabled",
    "nTokenToDollarRate",
    "minimumAmount",
  ];

  const updates = {};

  for (
    const field of allowedFields
  ) {
    if (
      Object.prototype.hasOwnProperty.call(
        values,
        field
      )
    ) {
      updates[field] =
        values[field];
    }
  }

  if (
    Object.keys(updates).length === 0
  ) {
    throw new Error(
      "No valid swap settings were provided."
    );
  }


  /*
   * Validate enabled.
   */
  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "enabled"
    )
  ) {
    updates.enabled =
      Boolean(
        updates.enabled
      );
  }


  /*
   * Validate exchange rate.
   */
  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "nTokenToDollarRate"
    )
  ) {
    const rate =
      Number(
        updates.nTokenToDollarRate
      );

    if (
      !Number.isFinite(rate) ||
      rate <= 0
    ) {
      throw new Error(
        "Swap rate must be greater than zero."
      );
    }

    updates.nTokenToDollarRate =
      rate;
  }


  /*
   * Validate minimum amount.
   */
  if (
    Object.prototype.hasOwnProperty.call(
      updates,
      "minimumAmount"
    )
  ) {
    const minimum =
      Number(
        updates.minimumAmount
      );

    if (
      !Number.isFinite(
        minimum
      ) ||
      minimum < 0
    ) {
      throw new Error(
        "Minimum swap amount must be non-negative."
      );
    }

    updates.minimumAmount =
      minimum;
  }


  return swapService.updateSwapSettings(
    updates
  );
};


/*
 * Enable swap.
 */
const enableSwap = async () => {
  return updateSwapSettings({
    enabled: true,
  });
};


/*
 * Disable swap.
 */
const disableSwap = async () => {
  return updateSwapSettings({
    enabled: false,
  });
};


/*
 * Update N Token → Dollar rate.
 */
const updateExchangeRate = async (
  rate
) => {
  return updateSwapSettings({
    nTokenToDollarRate: rate,
  });
};


/*
 * Update minimum swap amount.
 */
const updateMinimumAmount = async (
  amount
) => {
  return updateSwapSettings({
    minimumAmount: amount,
  });
};


/*
 * Calculate a swap.
 *
 * This delegates the calculation
 * to the existing swap module.
 */
const calculateSwap = async (
  amount
) => {
  const numericAmount =
    Number(amount);

  if (
    !Number.isFinite(
      numericAmount
    ) ||
    numericAmount <= 0
  ) {
    throw new Error(
      "Swap amount must be greater than zero."
    );
  }

  return swapService.calculateSwap(
    numericAmount
  );
};


const adminSwapService = {
  getSwapSettings,
  getSwapPairs,
  getSwapPairById,
  updateSwapSettings,
  enableSwap,
  disableSwap,
  updateExchangeRate,
  updateMinimumAmount,
  calculateSwap,
};


export default adminSwapService;
