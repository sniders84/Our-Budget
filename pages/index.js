import Layout from '../components/Layout'
import OverviewTab from '../components/OverviewTab'
import TransactionsTab from '../components/TransactionsTab'
import BudgetsTab from '../components/BudgetsTab'
import BillsTab from '../components/BillsTab'
import AnalyticsTab from '../components/AnalyticsTab'
import AccountsTab from '../components/AccountsTab'

export default function Home() {
  return (
    <Layout>
      {active => {
        switch(active) {
          case 'Overview': return <OverviewTab />
          case 'Transactions': return <TransactionsTab />
          case 'Budgets': return <BudgetsTab />
          case 'Bills': return <BillsTab />
          case 'Analytics': return <AnalyticsTab />
          case 'Accounts': return <AccountsTab />
          default: return <OverviewTab />
        }
      }}
    </Layout>
  )
}
