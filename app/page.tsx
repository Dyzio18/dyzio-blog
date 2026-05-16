import { getAllPostsSorted, allCoreContent } from '@/content/queries'
import Main from './Main'
import { getDictionary } from '@/lib/i18n/getDictionary'

export default async function Page() {
  const posts = allCoreContent(getAllPostsSorted())
  const { dict } = await getDictionary()
  return <Main posts={posts} dict={dict} />
}
