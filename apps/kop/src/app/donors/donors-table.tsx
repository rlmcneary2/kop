import {
  Box,
  Input,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import React from "react";
import { PhoneInput } from "@kop/ui";
import { useContextActions } from "../context";
import { ContextData, Donor } from "../type/type";

export function DonorsTable({ donors }: Props) {
  const { updateDonor } = useContextActions();

  // function handleOnChange(evt: React.ChangeEvent<HTMLInputElement>) {
  //   const [donor] = donors;
  //   updateDonor({ ...donor, firstName: evt.currentTarget.value });
  // }

  function handleInputChange(
    datastoreId: string,
    propertyName: keyof Donor,
    value: Donor[keyof Donor]
  ) {
    const donor = donors.find(item => item.datastoreId);
    donor && updateDonor({ ...donor, [propertyName]: value });
  }

  console.log("DonorsTable: render.");

  return (
    <Box borderRadius="md" borderWidth="1px" padding="1rem" w="100%">
      <Table>
        <TableCaption>Donors</TableCaption>
        <Thead>
          <Tr>
            <Th>First name</Th>
            <Th>Last name</Th>
            <Th>Phone</Th>
            <Th>Email</Th>
          </Tr>
        </Thead>
        <Tbody>
          {donors.map(item => (
            <Tr key={item.datastoreId}>
              <Td>
                <Input
                  onChange={evt =>
                    handleInputChange(
                      item.datastoreId,
                      "firstName",
                      evt.target.value
                    )
                  }
                  size="md"
                  value={item.firstName}
                  variant="flushed"
                />
              </Td>
              <Td>
                <Input
                  onChange={evt =>
                    handleInputChange(
                      item.datastoreId,
                      "lastName",
                      evt.target.value
                    )
                  }
                  size="md"
                  value={item.lastName}
                  variant="flushed"
                />
              </Td>
              <Td>
                <PhoneInput
                  onChange={phone =>
                    handleInputChange(item.datastoreId, "phone", phone)
                  }
                  size="md"
                  value={item.phone}
                  variant="flushed"
                />
              </Td>
              <Td>
                <Input
                  onChange={evt =>
                    handleInputChange(
                      item.datastoreId,
                      "email",
                      evt.target.value
                    )
                  }
                  size="md"
                  type="email"
                  value={item.email}
                  variant="flushed"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

interface Props {
  donors: Required<Required<ContextData>["donors"]>["data"];
}
