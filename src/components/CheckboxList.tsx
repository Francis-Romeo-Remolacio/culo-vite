import { Dispatch, SetStateAction } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { Tag } from "../utils/Schemas";

type CheckboxListProps = {
  designTags: Tag[];
  selectedTags: string[];
  setSelectedTags: Dispatch<SetStateAction<string[]>>;
};

const CheckboxList = ({
  designTags,
  selectedTags,
  setSelectedTags,
}: CheckboxListProps) => {
  const handleToggle = (tag: Tag) => {
    const currentIndex = selectedTags.indexOf(tag.designTagId);
    const newSelectedTags = [...selectedTags];

    if (currentIndex === -1) {
      newSelectedTags.push(tag.designTagId);
    } else {
      newSelectedTags.splice(currentIndex, 1);
    }

    setSelectedTags(newSelectedTags);
  };

  return (
    <List sx={{ width: "100%", maxWidth: 360 }}>
      {designTags.map((tag) => {
        const labelId = `checkbox-list-label-${tag.designTagId}`;

        return (
          <ListItem key={tag.designTagId} disablePadding>
            <ListItemButton
              role={undefined}
              onClick={() => {
                handleToggle(tag);
              }}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={selectedTags.indexOf(tag.designTagId) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={tag.designTagName} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default CheckboxList;
