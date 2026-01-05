import { View, Text, StyleSheet } from 'react-native';
import { useFamilyStore } from '@/store/familyStore';

export default function SettingsScreen() {
  const { currentFamily } = useFamilyStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>
      {currentFamily && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Política de Edad</Text>
          <Text style={styles.info}>
            Edad TEEN: {currentFamily.familyPolicy.teenAge}
          </Text>
          <Text style={styles.info}>
            Edad ADULTO: {currentFamily.familyPolicy.adultAge}
          </Text>
          <Text style={styles.info}>
            Promoción manual: {currentFamily.familyPolicy.allowManualPromotion ? 'Habilitada' : 'Deshabilitada'}
          </Text>
          <Text style={styles.info}>
            Rol TEEN: {currentFamily.familyPolicy.allowTeenRole ? 'Habilitado' : 'Deshabilitado'}
          </Text>
        </View>
      )}
      <Text style={styles.note}>
        La configuración de política de edad estará disponible en una próxima actualización.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  note: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});


