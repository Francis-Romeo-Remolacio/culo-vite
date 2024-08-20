import { useEffect, useState } from "react";
import { Badge, Button, Card, Group, Image, Text } from "@mantine/core";
import DefaultImage from "./../assets/design.png";
import { IconShoppingCartPlus, IconCreditCardPay } from "@tabler/icons-react";
import { Tag } from "./../utils/Schemas.ts";
import { Link } from "react-router-dom";

interface DesignCardProps {
  isSale?: boolean;
  id: string;
  designName: string;
  description: string;
  picture: string;
  tags: Tag[];
}

const DesignCard = ({
  isSale,
  id,
  designName,
  description,
  picture,
  tags,
}: DesignCardProps) => {
  const [imageType, setImageType] = useState<string>();

  useEffect(() => {
    const getImageType = (data: string) => {
      const firstChar = data.charAt(0);
      switch (firstChar) {
        case "/":
          setImageType("jpeg");
          break;
        case "i":
          setImageType("png");
          break;
        default:
          throw new Error("Unknown image type.");
      }
    };
    getImageType(picture);
  }, []);

  return (
    <Link to={`/view-design/?q=${id}`} style={{ textDecoration: "none" }}>
      <Card shadow="sm">
        <Card.Section>
          <Image
            src={`data:image/${imageType};base64,${picture}`}
            height={160}
            alt="Cake"
            fit="contain"
          />
        </Card.Section>

        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500}>{designName}</Text>
          {isSale && <Badge color="pink">On Sale</Badge>}
        </Group>

        <Text size="sm" c="dimmed">
          {description}
        </Text>

        <Group grow mt={4}>
          <Button color="blue" radius="md">
            <IconShoppingCartPlus />
          </Button>

          <Button color="blue" radius="md">
            <IconCreditCardPay />
          </Button>
        </Group>
      </Card>
    </Link>
  );
};

export default DesignCard;
