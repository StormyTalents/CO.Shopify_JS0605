import Image from 'next/image'
import Link from 'next/link'
import { blurlogo } from '@/components/icons'

function ProductCard({ product }) {

    return (
        <li className="collection--list" key={product.fields.url} role="group" aria-label="item">
          <Link href={product.fields.url} passHref >
            <a className="product--image prod--img">
              <Image
                src={product.fields.image?`https:${product.fields.image.fields.file.url}`:"/icons/placeholder.png"}
                alt={product.fields.image?product.fields.title:"aftco collection"}
                width={350}
                height={490}
                layout="responsive"
                placeholder="blur"
                blurDataURL={blurlogo}
              />
            </a>
          </Link>
        </li>
    )
}

export default ProductCard