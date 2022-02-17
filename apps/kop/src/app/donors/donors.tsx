import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Modal,
  ModalOverlay,
  Spacer,
  Spinner,
  VStack
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { ContextData, Donor } from "../type/type";
import { useContextActions, useContextData } from "../context";
import { DonorsTable } from "./donors-table";
import { DonorEditModal } from "./donor-edit-modal";

export function Donors() {
  const [editDonor, setEditDonor] = useState<Partial<Donor> | null>(null);
  const { createDonor, readDonors } = useContextActions();
  const { debounceActions, donors } = useContextData(contextSelector);

  useEffect(() => {
    if (donors?.status === "complete") {
      return;
    }

    if (!donors) {
      readDonors({ limit: 1, orderBy: "lastName" });
    }
  }, [donors, readDonors]);

  function handleAddDonorClick() {
    setEditDonor({});
  }

  function handleEditDonorModalChange(name: keyof Donor, value: string) {
    setEditDonor(current => {
      if (current && current[name] === value) {
        return current;
      }

      return {
        ...current,
        [name]: value
      };
    });
  }

  function handleEditDonorModalClose() {
    setEditDonor(null);
  }

  function handleEditDonorModalSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    editDonor && createDonor(editDonor as Donor);
    setEditDonor(null);
  }

  // console.log("Donors: editDonor=", editDonor);
  // console.log("Donors: debounceActions=", debounceActions);

  return (
    <Center w="100%">
      <Box maxW="1000px" padding="1rem" w="100%">
        <VStack>
          <Flex alignItems="center" w="100%">
            <Heading size="md">Donors</Heading>
            {debounceActions?.length && (
              <Spinner
                color="gray.400"
                emptyColor="gray.200"
                label="Saving changes"
                ml="1rem"
                speed="1s"
              />
            )}
            <Spacer />
            <Button
              leftIcon={<AddIcon />}
              onClick={handleAddDonorClick}
              size="sm"
            >
              New Donor
            </Button>
          </Flex>
          {donors?.data && <DonorsTable donors={donors.data} />}
        </VStack>
      </Box>
      <Modal
        isOpen={!!editDonor}
        onClose={handleEditDonorModalClose}
        onEsc={handleEditDonorModalClose}
        size="xl"
      >
        <ModalOverlay />
        <DonorEditModal
          donor={editDonor || {}}
          onChange={handleEditDonorModalChange}
          onClose={handleEditDonorModalClose}
          onSubmit={handleEditDonorModalSubmit}
        />
      </Modal>
    </Center>
  );
}

function contextSelector(ctx?: ContextData) {
  if (!ctx) {
    return {};
  }

  const { donors, debounceActions } = ctx;
  return { donors, debounceActions };
}
