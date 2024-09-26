// src\scenes\management\dashboard\index.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Tokens } from "../../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../../components/Header";
import StatBox from "../../../components/StatBox";
import LineChart from "../../../components/LineChart";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import GeographyChart from "../../../components/GeographyChart";
import ProgressCircle from "../../../components/ProgressCircle";
import { mockTransactions } from "../../../data/mockData";

import api from "../../../api/axiosConfig";

const Dashboard = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const [itemUsedOccurence, setItemUsedOccurence] = useState([]);
  const [tagsUsedOccurence, setTagsUsedOccurence] = useState([]);
  const [itemUsedSeasonalOccurence, setItemUsedSeasonalOccurence] = useState(
    []
  );

  const [topSales, setTopSales] = useState([]);
  const [totalSales, setTotalSales] = useState([]);
  const [totalOrders, setTotalOrders] = useState([]);

  const [
    itemUsedOccurenceCakeIngredientPieChartData,
    setItemUsedOccurenceCakeIngredientPieChartData,
  ] = useState([]);
  const [
    itemUsedOccurenceMaterialIngredientPieChartData,
    setItemUsedOccurenceMaterialIngredientPieChartData,
  ] = useState([]);
  const [tagsUsedOccurencePieChartData, setTagsUsedOccurencePieChartData] =
    useState([]);
  const [tagsUsedOccurenceBarChartData, setTagsUsedOccurenceBarChartData] =
    useState([]);
  const [totalSalesPieChartData, setTotalSalesPieChartData] = useState([]);

  useEffect(() => {
    setLoading(true);
    const getTotalSales = async () => {
      try {
        const response = await api.get("/Sales/totals");
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
        setItemUsedSeasonalOccurence({});
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

    getTotalSales();
    getTotalOrders();
    getTopSales();
    fetchIngredientsByOccurence();
    fetchTags();
    /*fetchItemUseBySeasonalOccurence()*/ setLoading(false);
  }, []);

  useEffect(() => {
    const parseFetchedData = async (dataToBeParsed) => {
      const parsedDataCakeIngUses = [];
      const parsedDataMaterialIngUses = [];
      dataToBeParsed.forEach((element) => {
        if (element.numOfUsesCakeIngredient >= 1) {
          const newParsedDataCakeIngUsesEntry = {
            id: element.itemId,
            label: element.itemType + ": " + element.itemName,
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
    };
    parseFetchedData(itemUsedOccurence);
  }, [itemUsedOccurence]);
  useEffect(() => {
    const parseFetchedData = async (dataToBeParsed) => {
      const parsedTagUses = [];
      dataToBeParsed.forEach((element) => {
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
    const parseFetchedData = async (dataToBeParsed) => {
      const parsedTotalSales = [];
      dataToBeParsed.forEach((element, index) => {
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
    <Box m="20px">
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        justifyItems="center"
        alignItems="center"
        backgroundColor={colors.panel}
        m="0 0 1rem 0"
        p="1rem 1rem 0 1rem"
        borderRadius="1rem"
        sx={{
          backdropFilter: "blur(24px)",
        }}
      >
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.pink,
              color: colors.text,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>
      <Box display="flex" flexDirection={"row"} flexWrap={"wrap"} pb={5}>
        <Box flexDirection={"column"} display="flex" padding={1} height={400}>
          <Box
            gridColumn="span 6"
            backgroundColor={colors.panel}
            display="flex"
            alignItems="center"
            justifyContent="left"
            p="1rem 1rem 0 1rem"
            m="0 0 1rem 0"
            borderRadius="1rem"
            padding={1}
            height={100}
            sx={{
              backdropFilter: "blur(24px)",
            }}
          >
            <Header title={"Total Sales: " + totalSales.total} />
          </Box>
          <Box
            gridColumn="span 6"
            backgroundColor={colors.panel}
            display="flex"
            alignItems="center"
            p="1rem 1rem 0 1rem"
            m="0 0 1rem 0"
            borderRadius="1rem"
            padding={1}
            height={100}
            sx={{
              backdropFilter: "blur(24px)",
            }}
          >
            <Header title={"Total Orders: " + totalOrders.total} />
          </Box>
        </Box>
        <Box
          flex="1 1 30%"
          flexDirection={"column"}
          backgroundColor={colors.panel}
          display="flex"
          alignItems="center"
          //p="1rem 1rem 0 1rem"
          m="0 0 3rem 0"
          borderRadius="1rem"
          padding={1}
          height={400}
          sx={{
            backdropFilter: "blur(24px)",
          }}
        >
          <Header title="Top Selling Products: " />
          <ResponsivePie
            data={totalSalesPieChartData}
            margin={{ top: 35, right: 35, bottom: 35, left: 35 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
              from: "color",
              modifiers: [["darker", 0.2]],
            }}
            enableArcLinkLabels={false}
            arcLabel={(d) => `${d.label}(${d.value})`}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
              from: "color",
              modifiers: [["darker", 2]],
            }}
          />
        </Box>
      </Box>
      <Divider />
      <Box display="flex" flexDirection="row" flexWrap="wrap">
        <Box
          flex="1 1 30%"
          backgroundColor={colors.panel}
          display="flex"
          flexDirection={"column"}
          alignItems="center"
          p="1rem 1rem 0 1rem"
          m="0 1rem 1rem 0"
          borderRadius="1rem"
          padding={1}
          height={400}
          sx={{
            backdropFilter: "blur(24px)",
          }}
        >
          <Header
            title="Ingredient use occurrence"
            subtitle="As pastry material"
          />
          <ResponsivePie
            data={itemUsedOccurenceCakeIngredientPieChartData}
            margin={{ top: 35, right: 35, bottom: 35, left: 35 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
              from: "color",
              modifiers: [["darker", 0.2]],
            }}
            enableArcLinkLabels={false}
            arcLabel={(d) => `${d.label}(${d.value})`}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
              from: "color",
              modifiers: [["darker", 2]],
            }}
          />
        </Box>
      </Box>
      <Divider />
      <Box display="flex" flexDirection="row" flexWrap="wrap" height={"400px"}>
        <Header title="Design tags use occurrence" />
        <ResponsiveBar
          data={tagsUsedOccurenceBarChartData}
          keys={["value"]}
          indexBy="label"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.4}
          valueScale={{ type: "linear" }}
          colors="#3182CE"
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
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
