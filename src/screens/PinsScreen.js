import React, { useEffect, useState } from "react";
import { View, StyleSheet, Share } from "react-native";
import { Card, List, IconButton, Text, Snackbar } from "react-native-paper";
import { loadPins, savePins } from "../storage";
import { toCardinal } from "../utils/geo"; // 

export default function PinsScreen() {
  const [pins, setPins] = useState([]);
  const [snack, setSnack] = useState("");

  useEffect(() => {
    // TODO(5): Load saved pins into state on mount
    const loadData = async () => {
      const savedPins = await loadPins();
      setPins(savedPins);
    };
    loadData();
  }, []);

  const remove = async (id) => {
    // TODO(6): Delete pin by id and persist via savePins(next)
    const nextPins = pins.filter((p) => p.id !== id);
    setPins(nextPins);
    await savePins(nextPins); 
    setSnack("TODO: delete pin");
  };

  const sharePin = async (p) => {
    // TODO(7): Share pin location nicely (include timestamp if you like)
    const cardinal = toCardinal(p.heading);
    const dateStr = new Date(p.ts).toLocaleString();
    
    const message = `Saved Location Pin:\nCoords: ${p.lat.toFixed(
      6
    )}, ${p.lon.toFixed(6)}\nHeading: ${cardinal} ${
      p.heading
    }°\nSaved On: ${dateStr}`;

    await Share.share({
        message,
        title: "Shared Pin Location",
    });
    setSnack(""); 
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Saved Pins" />
        <Card.Content>
          {pins.length === 0 ? (
            <Text>No pins yet. Drop one from Compass.</Text>
          ) : (
            <List.Section>
              {pins.map((p) => (
                <List.Item
                  key={p.id}
                  title={`${p.lat.toFixed(6)}, ${p.lon.toFixed(6)}`}
                  description={`${new Date(p.ts).toLocaleString()} (${toCardinal(p.heading)} ${p.heading}°)`}
                  left={(props) => <List.Icon {...props} icon="map-marker" />}
                  right={() => (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <IconButton
                        icon="share-variant"
                        onPress={() => sharePin(p)}
                      />
                      <IconButton icon="delete" onPress={() => remove(p.id)} />
                    </View>
                  )}
                />
              ))}
            </List.Section>
          )}
        </Card.Content>
      </Card>

      <Snackbar
        visible={!!snack}
        onDismiss={() => setSnack("")}
        duration={1200}
      >
        {snack}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 16 },
});
