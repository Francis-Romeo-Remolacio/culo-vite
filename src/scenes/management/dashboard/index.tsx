import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  useTheme,
  Grid2 as Grid,
} from "@mui/material";
import { Tokens } from "../../../Theme";
import Header from "../../../components/Header";
import { BarDatum, ResponsiveBar } from "@nivo/bar";
import api from "../../../api/axiosConfig";
import { ResponsiveLine } from "@nivo/line";
import {
  ChartData,
  ItemOccurence,
  OrdersOnDay,
  OrdersOnMonth,
  Sales,
  SalesOnDay,
  SalesOnMonth,
  SeasonalOccurence,
  TagOccurence,
  Total,
} from "../../../utils/Schemas";
import * as TimePeriods from "./../../../utils/TimePeriods.ts";

const Dashboard = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState(null);

  const gridStyle = {
    backgroundColor: colors.primary[200],
    padding: "10px",
    border: "solid 1px black",
    borderRadius: "10px",
  };

  const paperStyle = {
    p: 2,
    pb: "75px",
    xs: 6,
    width: "100%",
    maxHeight: "400px",
  };

  const gridItemStyle = {
    xs: 6,
    maxHeight: "400px",
    paddingLeft: "3px",
    paddingBottom: "50px",
    marginBottom: "25px",
  };

  const lineGraphLineColor = colors.analogous2[300];
  const lineGraphLineCurve = "linear";
  const gridColor = colors.text;

  const [itemUsedOccurence, setItemUsedOccurence] = useState<ItemOccurence[]>(
    []
  );
  const [tagsUsedOccurence, setTagsUsedOccurence] = useState<TagOccurence[]>(
    []
  );
  const [itemUsedSeasonalOccurence, setItemUsedSeasonalOccurence] = useState<
    SeasonalOccurence[]
  >([]);

  const [topSales, setTopSales] = useState<Sales[]>([]);
  const [totalSales, setTotalSales] = useState<Total>();
  const [totalOrders, setTotalOrders] = useState<Total>();

  const [totalSalesToday, setTotalSalesToday] = useState<SalesOnDay>();
  const [totalSalesInMonth, setTotalSalesInMonth] = useState<any[]>([]);
  const [totalSalesInYear, setTotalSalesInYear] = useState<any[]>([]);

  const [totalOrdersToday, setTotalOrdersToday] = useState<OrdersOnDay>();
  const [totalOrdersInMonth, setTotalOrdersInMonth] = useState<any[]>([]);
  const [totalOrdersInYear, setTotalOrdersInYear] = useState<any[]>([]);

  const [
    itemUsedOccurenceCakeIngredientPieChartData,
    setItemUsedOccurenceCakeIngredientPieChartData,
  ] = useState<ChartData[]>([]);
  const [
    itemUsedOccurenceMaterialIngredientPieChartData,
    setItemUsedOccurenceMaterialIngredientPieChartData,
  ] = useState<ChartData[]>([]);
  const [tagsUsedOccurencePieChartData, setTagsUsedOccurencePieChartData] =
    useState<ChartData[]>([]);
  const [totalSalesPieChartData, setTotalSalesPieChartData] = useState<
    ChartData[]
  >([]);

  const [tagsUsedOccurenceBarChartData, setTagsUsedOccurenceBarChartData] =
    useState<BarDatum[]>([]);
  const [
    itemUsedOccurenceCakeIngredientBarChartData,
    setItemUsedOccurenceCakeIngredientBarChartData,
  ] = useState<BarDatum[]>([]);

  useEffect(() => {
    setLoading(true);
    const currentDate = new Date();
    console.log(currentDate.getFullYear() + " " + currentDate.getMonth());

    const getTotalSales = async () => {
      try {
        const response = await api.get("/sales/totals");
        setTotalSales(response.data);
      } catch {
        setError("Failed to fetch total sales");
        console.error("Failed to fetch total sales:", error);
      }
    };
    const getTotalOrders = async () => {
      try {
        const response = await api.get("/orders/total-active-orders");
        setTotalOrders(response.data);
      } catch {
        setError("Failed to fetch total orders");
        console.error("Failed to fetch total orders:", error);
      }
    };
    const getTopSales = async () => {
      try {
        const response = await api.get("/Sales/top-sales");
        if (
          response.data !== undefined &&
          response.data !== null &&
          Object.is(response.data, [])
        ) {
          setTopSales(response.data);
        } else {
          setTopSales([
            { name: "Example 1", total: 5 },
            { name: "Example 2", total: 4 },
            { name: "Example 5", total: 3 },
            { name: "Example 4", total: 2 },
            { name: "Example 3", total: 1 },
          ]);
        }
      } catch {
        setError("Failed to fetch top sales");
        console.error("Failed to fetch top sales:", error);
      }
    };
    const fetchIngredientsByOccurence = async () => {
      try {
        const response = await api.get("/data-analysis/item-used/occurrence");
        setItemUsedOccurence(response.data);
      } catch (error) {
        setError("Failed to fetch ingredients used by occurence");
        console.error("Failed to fetch ingredients used by occurence:", error);
      }
    };
    const fetchTags = async () => {
      try {
        const response = await api.get("/data-analysis/tags-used/occurrence");
        setTagsUsedOccurence(response.data);
      } catch (error) {
        setError("Failed to fetch tags used by occurence");
        console.error("Failed to fetch tags used by occurence:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchItemUseBySeasonalOccurence = async () => {
      try {
        const response = await api.get(
          "/data-analysis/item-used/seasonal-occurrence"
        );
        setItemUsedSeasonalOccurence([]);
      } catch (error) {
        setError("Failed to fetch ingredients used by seasonal occurence");
        console.error(
          "Failed to fetch ingredients used by seasonal occurence:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    const getTotalSalesToday = async () => {
      try {
        const response = await api.get(
          `/sales/total/day?year=${currentDate.getFullYear()}&month=${
            currentDate.getMonth() + 1
          }&day=${currentDate.getDate()}`
        );
        setTotalSalesToday(response.data);
      } catch {
        setError("Failed to fetch total sales today");
        console.error("Failed to fetch total sales today: ", error);
      }
    };
    const getTotalSalesThisMonth = async () => {
      try {
        var response = await api.get(
          `/sales/total/month?year=${currentDate.getFullYear()}&month=${
            currentDate.getMonth() + 1
          }`
        );

        const daysInMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          0
        ).getDate();
        var parsedData: any = [
          {
            id: "This Month",
            color: lineGraphLineColor,
            data: [],
          },
        ];

        for (let i = 1; i <= daysInMonth; i++) {
          const foundSalesInResponse = response.data.find(
            (t: any) => t.day === i
          );
          if (
            foundSalesInResponse !== undefined &&
            foundSalesInResponse !== null
          ) {
            parsedData[0].data.push({
              x: i,
              y: foundSalesInResponse.totalSales,
            });
          } else {
            parsedData[0].data.push({ x: i, y: 0 });
          }
        }

        setTotalSalesInMonth(parsedData);
      } catch {
        setError("Failed to fetch total sales today");
        console.error("Failed to fetch total sales today: ", error);
      }
    };
    const getTotalSalesThisYear = async () => {
      try {
        var response = await api.get(
          `/sales/total/year?year=${currentDate.getFullYear()}`
        );
        var parsedData: any = [
          {
            id: "This Year",
            color: lineGraphLineColor,
            data: [],
          },
        ];
        for (let i = 0; i < TimePeriods.Months.length; i++) {
          const foundSalesInResponse = response.data.find(
            (t: any) => t.month === TimePeriods.Months[i]
          );
          if (
            foundSalesInResponse !== undefined &&
            foundSalesInResponse !== null
          ) {
            parsedData[0].data.push({
              x: TimePeriods.Months[i],
              y: foundSalesInResponse.totalSales,
            });
          } else {
            parsedData[0].data.push({ x: TimePeriods.Months[i], y: 0 });
          }
        }

        setTotalSalesInYear(parsedData);
      } catch {
        setError("Failed to fetch total sales today");
        console.error("Failed to fetch total sales today: ", error);
      }
    };

    const getTotalOrdersToday = async () => {
      try {
        const response = await api.get(
          `/orders/total-order-quantity/day?year=${currentDate.getFullYear()}&month=${
            currentDate.getMonth() + 1
          }&day=${currentDate.getDate()}`
        );
        setTotalOrdersToday(response.data);
      } catch {
        setError("Failed to fetch total orders today");
        console.error("Failed to fetch total orders today: ", error);
      }
    };
    const getTotalOrdersThisMonth = async () => {
      try {
        var response = await api.get(
          `/orders/total-order-quantity/month?year=${currentDate.getFullYear()}&month=${
            currentDate.getMonth() + 1
          }`
        );

        const daysInMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          0
        ).getDate();
        var parsedData: any = [
          {
            id: "This Month",
            color: lineGraphLineColor,
            data: [],
          },
        ];

        for (let i = 1; i <= daysInMonth; i++) {
          const foundSalesInResponse = response.data.find(
            (t: any) => t.day === i
          );
          if (
            foundSalesInResponse !== undefined &&
            foundSalesInResponse !== null
          ) {
            parsedData[0].data.push({
              x: i,
              y: foundSalesInResponse.totalOrders,
            });
          } else {
            parsedData[0].data.push({ x: i, y: 0 });
          }
        }

        setTotalOrdersInMonth(parsedData);
      } catch {
        setError("Failed to fetch total orders today");
        console.error("Failed to fetch total orders today: ", error);
      }
    };
    const getTotalOrdersThisYear = async () => {
      try {
        var response = await api.get(
          `/orders/total-order-quantity/year?year=${currentDate.getFullYear()}`
        );
        var parsedData: any = [
          {
            id: "This Year",
            color: lineGraphLineColor,
            data: [],
          },
        ];
        for (let i = 0; i < TimePeriods.Months.length; i++) {
          const foundSalesInResponse = response.data.find(
            (t: any) => t.month === TimePeriods.Months[i]
          );
          if (
            foundSalesInResponse !== undefined &&
            foundSalesInResponse !== null
          ) {
            parsedData[0].data.push({
              x: TimePeriods.Months[i],
              y: foundSalesInResponse.totalOrders,
            });
          } else {
            parsedData[0].data.push({ x: TimePeriods.Months[i], y: 0 });
          }
        }

        setTotalOrdersInYear(parsedData);
      } catch {
        setError("Failed to fetch total orders today");
        console.error("Failed to fetch total orders today: ", error);
      }
    };

    getTotalSales();
    getTotalOrders();
    getTopSales();
    fetchIngredientsByOccurence();
    fetchTags();

    getTotalSalesToday();
    getTotalSalesThisMonth();
    getTotalSalesThisYear();

    getTotalOrdersToday();
    getTotalOrdersThisMonth();
    getTotalOrdersThisYear();

    /*fetchItemUseBySeasonalOccurence()*/ setLoading(false);
  }, []);

  useEffect(() => {
    const parseFetchedData = async (dataToBeParsed: any) => {
      const parsedDataCakeIngUses: any[] = [];
      const parsedDataMaterialIngUses: any[] = [];
      dataToBeParsed.forEach((element: any) => {
        if (element.numOfUsesCakeIngredient >= 1) {
          const newParsedDataCakeIngUsesEntry = {
            id: element.itemId,
            label: element.itemName,
            value: element.numOfUsesCakeIngredient,
          };
          parsedDataCakeIngUses.push(newParsedDataCakeIngUsesEntry);
        }
        if (element.numOfUsesMaterialIngredient >= 1) {
          const newParsedDataMaterialIngUses = {
            id: element.itemId,
            label: element.itemType + ": " + element.itemName,
            value: element.numOfUsesMaterialIngredient,
          };
          parsedDataMaterialIngUses.push(newParsedDataMaterialIngUses);
        }
      });
      setItemUsedOccurenceMaterialIngredientPieChartData(
        parsedDataMaterialIngUses
      );
      setItemUsedOccurenceCakeIngredientPieChartData(parsedDataCakeIngUses);
      setItemUsedOccurenceCakeIngredientBarChartData(parsedDataCakeIngUses);
    };
    parseFetchedData(itemUsedOccurence);
  }, [itemUsedOccurence]);
  useEffect(() => {
    const parseFetchedData = async (dataToBeParsed: any) => {
      const parsedTagUses: any[] = [];
      dataToBeParsed.forEach((element: any) => {
        parsedTagUses.push({
          id: element.designTagId,
          label: element.designTagName,
          value: element.occurrenceCount,
        });
      });
      setTagsUsedOccurencePieChartData(parsedTagUses);
      setTagsUsedOccurenceBarChartData(parsedTagUses);
    };
    parseFetchedData(tagsUsedOccurence);
  }, [tagsUsedOccurence]);
  useEffect(() => {
    const parseFetchedData = async (dataToBeParsed: any) => {
      const parsedTotalSales: any[] = [];
      dataToBeParsed.forEach((element: any, index: number) => {
        parsedTotalSales.push({
          id: index,
          label: element.name,
          value: element.total,
        });
      });
      setTotalSalesPieChartData(parsedTotalSales);
    };
    parseFetchedData(topSales);
  }, [topSales]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <Box>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          justifyItems: "center",
          alignItems: "center",
          backgroundColor: colors.panel,
          m: "0 0 1rem 0",
          p: "1rem 1rem 0 1rem",
          borderRadius: "1rem",
          backdropFilter: "blur(24px)",
        }}
      >
        <Header title="DASHBOARD" subtitle="Welcome to the CULO BOM System" />
      </Box>

      {/* //New */}

      <Stack spacing={2}>
        {/* Total Sales */}
        <Paper
          sx={{
            p: 2,
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.primary[100],
          }}
        >
          <Stack spacing={2}>
            <Paper
              sx={{
                p: 2,
              }}
            >
              <Header title="Total Sales" />
              <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                  {/* All Time */}
                  <Paper
                    sx={{
                      p: 2,
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: colors.analogous1[100],
                    }}
                  >
                    <Header title={"All Time: " + totalSales?.total} />
                  </Paper>
                  {/* Today */}
                  <Paper
                    sx={{
                      p: 2,
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: colors.analogous1[100],
                    }}
                  >
                    <Header title={"Today: " + totalSalesToday?.totalSales} />
                  </Paper>
                </Stack>
              </Stack>
            </Paper>
            <Stack direction="row" spacing={2}>
              <Paper sx={paperStyle}>
                <Header title="Sales this month" />
                <ResponsiveLine
                  colors={lineGraphLineColor}
                  margin={{ top: 25, right: 110, bottom: 50, left: 60 }}
                  xScale={{ type: "point" }}
                  yScale={{
                    type: "linear",
                    min: "auto",
                    max: "auto",
                    stacked: true,
                    reverse: false,
                  }}
                  yFormat=" >-.2f"
                  pointSize={10}
                  pointColor={{ theme: "background" }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: "serieColor" }}
                  pointLabel="data.yFormatted"
                  pointLabelYOffset={-12}
                  enableTouchCrosshair={true}
                  useMesh={true}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Number of Sales",
                    legendOffset: -40,
                    legendPosition: "middle",
                    truncateTickAt: 0,
                  }}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Day",
                    legendOffset: 36,
                    legendPosition: "middle",
                    truncateTickAt: 0,
                  }}
                  curve={lineGraphLineCurve}
                  lineWidth={4}
                  data={totalSalesInMonth}
                  theme={{
                    axis: {
                      ticks: { text: { fill: gridColor } },
                      legend: { text: { fill: gridColor } },
                    },
                    grid: { line: { stroke: gridColor } },
                  }}
                />
              </Paper>

              <Paper
                sx={{
                  p: 2,
                  pb: "75px",
                  xs: 6,
                  width: "100%",
                  maxHeight: "400px",
                }}
              >
                <Header title="Sales this year" />
                <ResponsiveLine
                  colors={lineGraphLineColor}
                  margin={{ top: 25, right: 110, bottom: 50, left: 60 }}
                  xScale={{ type: "point" }}
                  yScale={{
                    type: "linear",
                    min: "auto",
                    max: "auto",
                    stacked: true,
                    reverse: false,
                  }}
                  yFormat=" >-.2f"
                  pointSize={10}
                  pointColor={{ theme: "background" }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: "serieColor" }}
                  pointLabel="data.yFormatted"
                  pointLabelYOffset={-12}
                  enableTouchCrosshair={true}
                  useMesh={true}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 90,
                    legend: "Number of Sales",
                    legendOffset: -40,
                    legendPosition: "middle",
                    truncateTickAt: 0,
                  }}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 90,
                    legendOffset: 36,
                    legendPosition: "middle",
                    truncateTickAt: 0,
                  }}
                  curve={lineGraphLineCurve}
                  lineWidth={4}
                  data={totalSalesInYear}
                  theme={{
                    axis: {
                      ticks: { text: { fill: gridColor } },
                      legend: { text: { fill: gridColor } },
                    },
                    grid: { line: { stroke: gridColor } },
                  }}
                />
              </Paper>
            </Stack>
          </Stack>
        </Paper>

        {/* Total Orders */}
        <Paper
          sx={{
            p: 2,
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.primary[100],
          }}
        >
          <Stack>
            <Paper sx={paperStyle}>
              <Header title={"Total Orders: " + totalOrders?.total} />
            </Paper>

            <Grid size={{ xs: 6 }} style={gridItemStyle}>
              <Header title="Orders this month" />
              <ResponsiveLine
                colors={lineGraphLineColor}
                margin={{ top: 25, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{
                  type: "linear",
                  min: "auto",
                  max: "auto",
                  stacked: true,
                  reverse: false,
                }}
                yFormat=" >-.2f"
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabel="data.yFormatted"
                pointLabelYOffset={-12}
                enableTouchCrosshair={true}
                useMesh={true}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Number of Orders",
                  legendOffset: -40,
                  legendPosition: "middle",
                  truncateTickAt: 0,
                }}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Day",
                  legendOffset: 36,
                  legendPosition: "middle",
                  truncateTickAt: 0,
                }}
                curve={lineGraphLineCurve}
                lineWidth={4}
                data={totalOrdersInMonth}
                theme={{
                  axis: {
                    ticks: { text: { fill: gridColor } },
                    legend: { text: { fill: gridColor } },
                  },
                  grid: { line: { stroke: gridColor } },
                }}
              />
            </Grid>

            <Grid size={{ xs: 6 }} style={gridItemStyle}>
              <Header title="Orders this year" />
              <ResponsiveLine
                colors={lineGraphLineColor}
                margin={{ top: 25, right: 110, bottom: 60, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{
                  type: "linear",
                  min: "auto",
                  max: "auto",
                  stacked: true,
                  reverse: false,
                }}
                yFormat=" >-.2f"
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabel="data.yFormatted"
                pointLabelYOffset={-12}
                enableTouchCrosshair={true}
                useMesh={true}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Number of Orders",
                  legendOffset: -40,
                  legendPosition: "middle",
                  truncateTickAt: 0,
                }}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 90,
                  legendOffset: 36,
                  legendPosition: "middle",
                  truncateTickAt: 0,
                }}
                curve={lineGraphLineCurve}
                lineWidth={4}
                data={totalOrdersInYear}
                theme={{
                  axis: {
                    ticks: { text: { fill: gridColor } },
                    legend: { text: { fill: gridColor } },
                  },
                  grid: { line: { stroke: gridColor } },
                }}
              />
            </Grid>
          </Stack>
        </Paper>

        {/* Occurences */}
        <Paper
          sx={{
            p: 2,
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.primary[100],
          }}
        >
          <Grid container marginBottom={10} style={gridStyle}>
            <Grid size={{ xs: 6 }} style={gridItemStyle}>
              <Header title="Design tags use occurrence" />
              <ResponsiveBar
                data={tagsUsedOccurenceBarChartData}
                keys={["value"]}
                indexBy="label"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.4}
                valueScale={{ type: "linear" }}
                colors="#98F5F9"
                animate={true}
                enableLabel={false}
                axisTop={null}
                axisRight={null}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Number of Uses",
                  legendPosition: "middle",
                  legendOffset: -40,
                }}
                theme={{
                  axis: {
                    ticks: { text: { fill: gridColor } },
                    legend: { text: { fill: gridColor } },
                  },
                  grid: { line: { stroke: gridColor } },
                }}
              />
            </Grid>
            <Grid size={{ xs: 6 }} style={gridItemStyle}>
              <Header title="Ingredient use in design ingredients" />
              <ResponsiveBar
                data={itemUsedOccurenceCakeIngredientBarChartData}
                keys={["value"]}
                indexBy="label"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.4}
                valueScale={{ type: "linear" }}
                colors="#E5D900"
                animate={true}
                enableLabel={false}
                axisTop={null}
                axisRight={null}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Number of Uses",
                  legendPosition: "middle",
                  legendOffset: -40,
                }}
                theme={{
                  axis: {
                    ticks: { text: { fill: gridColor } },
                    legend: { text: { fill: gridColor } },
                  },
                  grid: { line: { stroke: gridColor } },
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Stack>
    </Box>
  );
};

export default Dashboard;
