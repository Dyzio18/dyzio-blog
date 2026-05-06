'use client';

import NewsletterForm from './NewsletterForm';

interface BlogNewsletterFormProps {
  title?: string;
  description?: string;
}

export default function BlogNewsletterForm({
  title = 'Nie przegap kolejnych wpisów',
  description = 'Krótki mail, gdy pojawi się nowy tekst. Bez spamu i bez kombinowania.',
}: BlogNewsletterFormProps) {
  return <NewsletterForm title={title} description={description} compact />;
}