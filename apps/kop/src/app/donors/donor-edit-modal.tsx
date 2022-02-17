import {
  Button,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  SimpleGrid
} from "@chakra-ui/react";
import React from "react";
import { Donor, DatastoreObject } from "../type/type";

export function DonorEditModal({ donor, onChange, onClose, onSubmit }: Props) {
  return (
    <ModalContent>
      <form autoComplete="off" onSubmit={onSubmit}>
        <ModalHeader>
          {donor?.datastoreId
            ? `Edit Donor ${donor.firstName} ${donor.lastName}`
            : "Add New Donor"}
        </ModalHeader>
        {donor && <ModalFormBody donor={donor} onChange={onChange} />}
        <ModalFooter>
          <Button mr="1rem" onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button colorScheme="blue" type="submit">
            OK
          </Button>
        </ModalFooter>
        <ModalCloseButton />
      </form>
    </ModalContent>
  );
}

function ModalFormBody({
  donor,
  onChange
}: {
  donor: Partial<Donor>;
  onChange: Props["onChange"];
}) {
  return (
    <ModalBody>
      <SimpleGrid minChildWidth="12rem" spacing="1rem">
        <FormControl isRequired>
          <FormLabel htmlFor="firstName">First name</FormLabel>
          <Input
            id="firstName"
            onChange={evt => onChange("firstName", evt.currentTarget.value)}
            placeholder="Jane"
            type="text"
            value={donor.firstName ?? ""}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="name">Last name</FormLabel>
          <Input
            id="lastName"
            onChange={evt => onChange("lastName", evt.currentTarget.value)}
            placeholder="Doe"
            type="text"
            value={donor.lastName ?? ""}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="phone">Phone number</FormLabel>
          <Input
            id="phone"
            onChange={evt => onChange("phone", evt.currentTarget.value)}
            placeholder="(555) 555-5555"
            type="tel"
            value={donor.phone ?? ""}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="email">Email address</FormLabel>
          <Input
            id="email"
            onChange={evt => onChange("email", evt.currentTarget.value)}
            placeholder="name@example.com"
            type="email"
            value={donor.email ?? ""}
          />
        </FormControl>
      </SimpleGrid>
    </ModalBody>
  );
}

interface Props {
  donor: Partial<DatastoreObject<Donor>>;
  onChange: (name: keyof Donor, value: string) => void;
  onClose: () => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}
