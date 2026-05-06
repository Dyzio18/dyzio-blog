import { getAllPostsSorted, allCoreContent } from '@/content/queries'
import Main from './Main'

export default async function Page() {
  const posts = allCoreContent(getAllPostsSorted())
  return <Main posts={posts} />
}