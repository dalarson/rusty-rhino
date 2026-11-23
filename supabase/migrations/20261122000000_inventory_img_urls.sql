alter table public.inventory
    add column img_urls text[] not null default '{}';

update public.inventory
set img_urls = array_remove(
    array[img_url] || before_img_urls || after_img_urls, null);
