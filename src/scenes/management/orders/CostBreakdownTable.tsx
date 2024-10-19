import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { Breakdown } from "../../../utils/Schemas";

type CostBreakdownTableProps = {
  data: Breakdown[];
};

const CostBreakdownTable = ({ data }: CostBreakdownTableProps) => {
  const breakdown = data[0]; // Assuming you're dealing with a single entry for now

  return (
    <TableContainer component={Paper}>
      <Table>
        {/* Ingredient Cost Breakdown */}
        <TableHead>
          <TableRow>
            <TableCell colSpan={7}>
              <Typography variant="h6">Ingredient Cost Breakdown</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Item ID</TableCell>
            <TableCell>Item Name</TableCell>
            <TableCell>Inventory Price</TableCell>
            <TableCell>Inventory Quantity</TableCell>
            <TableCell>Inventory Amount Unit</TableCell>
            <TableCell>Amount Quantity Type</TableCell>
            <TableCell>Calculated Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {breakdown.ingredientCostBreakdown.map((ingredient, index) => (
            <TableRow key={index}>
              <TableCell>{ingredient.itemId}</TableCell>
              <TableCell>{ingredient.itemName}</TableCell>
              <TableCell>{ingredient.inventoryPrice}</TableCell>
              <TableCell>{ingredient.inventoryQuantity}</TableCell>
              <TableCell>{ingredient.inventoryAmountUnit}</TableCell>
              <TableCell>{ingredient.amountQuantityType}</TableCell>
              <TableCell>{ingredient.calculatedPrice}</TableCell>
            </TableRow>
          ))}
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
            <TableCell>{breakdown.otherCostBreakdown.additionalCost}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Ingredient Cost Multiplier</TableCell>
            <TableCell>
              {breakdown.otherCostBreakdown.ingredientCostMultiplier}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CostBreakdownTable;
