import { Center, Loader } from "@mantine/core";

const FullscreenThrobber = () => {
  return (
    <Center h="100vh">
      <Loader size={64} />
    </Center>
  );
};

export default FullscreenThrobber;
