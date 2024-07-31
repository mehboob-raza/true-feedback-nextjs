'use client'

import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from '@/messages.json'
import Autoplay from 'embla-carousel-autoplay'

export default function Home() {
  return (
    <>
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          Dive into the World of Anonymous Conversations
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">Explore Mystry Messages, where your identity remains a secret</p>
      </section>

      <Carousel
        plugins={[Autoplay({delay: 5000})]}
        className="w-full max-w-xs">
      <CarouselContent>
        {
            messages.map((msg, index) => {
            return  <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardHeader> {msg.title} </CardHeader>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-lg font-semibold">{ msg.content}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          })
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </main>
    <footer>
      Mystry Messages, All Rights Reserved
    </footer>
    </>
  );
}
