import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import { Breakdown, ManagementOrder } from "../../../utils/Schemas";
import { toCurrency } from "../../../utils/Formatter";

type CostBreakdownTableProps = {
  data: Breakdown[];
  orderData: ManagementOrder;
};

const CostBreakdownTable = ({ data, orderData }: CostBreakdownTableProps) => {
  const breakdown = data[0];

  return (
    <>
      {data.map((breakdownData) => (
        <TableContainer component={Paper} sx={{marginBottom: 5}}>
          <Table>
            {/* Ingredient Cost Breakdown */}
            <TableHead>
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography variant="h6">
                    Ingredient Cost Breakdown
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Item Name</TableCell>
                <TableCell align="right">Unit Cost</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell>Amount Unit</TableCell>
                <TableCell align="right">Total Cost</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {breakdownData.ingredientCostBreakdown.map(
                (ingredient, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{ingredient.itemName}</TableCell>
                    <TableCell align="right">
                      {toCurrency(ingredient.inventoryPrice)}
                    </TableCell>
                    <TableCell align="right">
                      {ingredient.inventoryQuantity.toFixed(2)}
                    </TableCell>
                    <TableCell>{ingredient.inventoryAmountUnit}</TableCell>
                    <TableCell align="right">
                      {toCurrency(ingredient.calculatedPrice)}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>

            {/* Other Cost Breakdown */}
            <TableHead>
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography variant="h6">Other Cost Breakdown</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2}>Additional Cost</TableCell>
                <TableCell align="right">
                  {toCurrency(breakdownData.otherCostBreakdown.additionalCost)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Ingredient Cost Multiplier</TableCell>
                <TableCell align="right">
                  {breakdownData.otherCostBreakdown.ingredientCostMultiplier}
                </TableCell>
              </TableRow>
            </TableBody>

            {/* Totals */}
            <TableHead>
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography variant="h6">Totals</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5}>Total Ingredient Price</TableCell>
                <TableCell align="right">
                  {toCurrency(breakdownData.totalIngredientPrice)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5}>
                  Total Ingredient Price (w/ Other Costs)
                </TableCell>
                <TableCell align="right">
                  {toCurrency(
                    breakdownData.totalIngredientPriceWithOtherCostIncluded
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5}>
                  Total Ingredient Price (Rounded)
                </TableCell>
                <TableCell align="right">
                  {toCurrency(
                    breakdownData.totalIngredientPriceWithOtherCostIncludedRounded
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </>
  );
};

export default CostBreakdownTable;
