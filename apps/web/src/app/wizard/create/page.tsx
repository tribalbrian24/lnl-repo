import { getDbClient } from '@repo/db';
import WizardClient from "./WizardClient";

async function getStages() {
  const { db } = getDbClient();
  return await db
    .selectFrom('stages')
    .select(['id', 'label'])
    .orderBy('display_order', 'asc')
    .execute();
}


export default async function WizardPage() {
  const stages = await getStages();
  return <WizardClient stages={stages} />;
}
