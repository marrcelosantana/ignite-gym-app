import { useState } from "react";
import { SectionList, Text } from "native-base";
import { Heading, VStack } from "native-base";

import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";

export function History() {
  const [exercises, setExercises] = useState([
    {
      title: "26.08.2022",
      data: ["Puxada frontal", "Remada unilateral"],
    },
    {
      title: "27.08.2022",
      data: ["Puxada frontal"],
    },
  ]);
  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de exercícios" />

      <SectionList
        sections={exercises}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <HistoryCard />}
        renderSectionHeader={({ section }) => (
          <Heading
            color="gray.200"
            fontSize="md"
            fontFamily="heading"
            mt={10}
            mb={3}
          >
            {section.title}
          </Heading>
        )}
        px={8}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: "center" }
        }
        ListEmptyComponent={() => (
          <Text color="gray.100" textAlign="center">
            Não há exercícios registrados ainda. {"\n"}
            Vamos fazer exercícios hoje?
          </Text>
        )}
      />
    </VStack>
  );
}
