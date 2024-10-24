import { Center, VStack } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { CreateEnterprise } from "@/components/EnterpriseComponents"
import { GetReports } from "@/components/ReportComponents/GetReports/GetReports";
function Landing() {
  return (
    <>
    <Center>
      <VStack>
      </VStack>  
    </Center>
    <CreateEnterprise />
    <GetReports />
    </>
     
  );
}

export { Landing };
