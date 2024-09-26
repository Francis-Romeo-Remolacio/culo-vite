import React, { useState, useEffect } from "react";
import Chip from "@mui/material/Chip";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

type TagChipProps = {
  id: string;
  name?: string;
};

const TagChip = ({ id, name }: TagChipProps) => {
  const [tagName, setTagName] = useState(name || "");
  const navigate = useNavigate();

  useEffect(() => {
    if (!name) {
      const fetchTags = async () => {
        try {
          const response = await api.get(`/tags/${id}`);
          const tag = response.data;
          setTagName(tag.designTagName);
        } catch (error) {
          console.error("Error fetching tags:", error);
        }
      };

      if (id) {
        fetchTags();
      }
    }
  }, [id, name]);

  const handleClick = () => {
    navigate(`/results?tag-id=${id}`);
  };

  return <Chip label={tagName} onClick={handleClick} />;
};

export default TagChip;
