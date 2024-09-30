import { Dispatch, SetStateAction, useContext } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { Tag } from "../utils/Schemas";
import { RefreshContext } from "../scenes/shop";

type TagsCheckboxListProps = {
  tags: Tag[];
  selectedTags: string[];
  setSelectedTags: Dispatch<SetStateAction<string[]>>;
};

const TagsCheckboxList = ({
  tags,
  selectedTags,
  setSelectedTags,
}: TagsCheckboxListProps) => {
  const { isRefreshing } = useContext(RefreshContext);

  const handleToggle = (tag: Tag) => {
    const currentIndex = selectedTags.indexOf(tag.id);
    const newSelectedTags = [...selectedTags];

    if (currentIndex === -1) {
      newSelectedTags.push(tag.id);
    } else {
      newSelectedTags.splice(currentIndex, 1);
    }

    setSelectedTags(newSelectedTags);
  };

  return (
    <>
      <List sx={{ width: "100%", maxWidth: 360 }}>
        {tags.map((tag) => {
          const labelId = `checkbox-list-label-${tag.id}`;

          return (
            <ListItem key={tag.id} disablePadding>
              <ListItemButton
                role={undefined}
                onClick={() => {
                  handleToggle(tag);
                }}
                dense
                disabled={isRefreshing}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedTags.indexOf(tag.id) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={tag.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

export default TagsCheckboxList;
