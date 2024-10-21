import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid2 as Grid,
  Pagination,
  Stack,
} from "@mui/material";
import api from "./../api/axiosConfig.js";
import DesignCard from "./DesignCard.tsx";
import { Design } from "../utils/Schemas.js";
import { AxiosResponse } from "axios";

type DesignGalleryProps = {
  tagFilter?: string[];
  selectedTags?: string[];
  searchQuery?: string;
  setIsRefreshing?: React.Dispatch<SetStateAction<boolean>>;
  landing?: boolean;
};

const DesignGallery = ({
  tagFilter,
  selectedTags,
  searchQuery,
  setIsRefreshing,
  landing,
}: DesignGalleryProps) => {
  const [fetchedDesigns, setFetchedDesigns] = useState<Design[]>([]);
  const [outputDesigns, setOutputDesigns] = useState<Design[]>([]);
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);

  function parseDesigns(response: AxiosResponse): Design[] {
    return response.data.map((design: any) => ({
      id: design.designId,
      name: design.displayName,
      description: design.cakeDescription,
      tags: design.designTags.map((tag: any) => ({
        id: tag.designTagId,
        name: tag.designTagName,
      })),
      shapes: design.designShapes.map((shape: any) => ({
        id: shape.designShapeId,
        name: shape.shapeName,
      })),
    }));
  }

  const handleChangePage = (event: ChangeEvent<unknown>, page: number) => {
    setPage(page);
  };

  useEffect(() => {
    const fetchDesigns = async () => {
      if (setIsRefreshing) {
        setIsRefreshing(true);
      }
      if (searchQuery) {
        try {
          const response = await api.get("designs/search/by-name", {
            params: {
              name: searchQuery,
            },
          });
          const parsedDesigns: Design[] = parseDesigns(response);
          const limitedDesigns = parsedDesigns.slice(0, 6); // Limit to 6 designs
          setFetchedDesigns(limitedDesigns);
          setOutputDesigns(limitedDesigns);
        } catch (error) {
          console.error(error);
        } finally {
          if (setIsRefreshing) {
            setIsRefreshing(false);
          }
        }
      } else {
        try {
          const tagsQuery = tagFilter?.length
            ? `/designs/with-tags/${tagFilter.join(",")}`
            : `/designs?page=${page}&record_per_page=${landing ? 4 : 18}`;

          const response = await api.get(tagsQuery);
          const parsedDesigns: Design[] = parseDesigns(response);
          const limitedDesigns = parsedDesigns.slice(0, 6); // Limit to 6 designs
          setFetchedDesigns(limitedDesigns);
          setOutputDesigns(limitedDesigns);
          setMaxPages(response.headers["X-Number-Of-Pages"]);
        } catch (error) {
          console.error("Error fetching designs:", error);
        } finally {
          if (setIsRefreshing) {
            setIsRefreshing(false);
          }
        }
      }
    };

    fetchDesigns();
  }, [tagFilter, page]); // Re-fetch when tagFilter or page changes

  const checkFilter = () => {
    if (setIsRefreshing) {
      setIsRefreshing(true);
    }
    if (selectedTags && selectedTags.length > 0) {
      setOutputDesigns(
        fetchedDesigns.filter((design) =>
          design.tags.some((tag) => selectedTags.includes(tag.id))
        )
      );
      if (setIsRefreshing) {
        setIsRefreshing(false);
      }
    } else {
      setOutputDesigns(fetchedDesigns); // Reset to all designs if no filter
      if (setIsRefreshing) {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    checkFilter();
  }, [selectedTags, fetchedDesigns]); // Re-run filter whenever selectedTags or fetchedDesigns change

  return (
    <Stack alignItems="center">
      <Grid container spacing={1} justifyContent="center" sx={{ p: 2 }}>
        {outputDesigns.map((design) => (
          <Grid key={design.id}>
            <DesignCard design={design} />
          </Grid>
        ))}
      </Grid>
      {!landing ? (
        <Pagination count={maxPages} page={page} onChange={handleChangePage} />
      ) : null}
    </Stack>
  );
};

export default DesignGallery;
