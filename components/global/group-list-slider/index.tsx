"use client"

import React from "react"
import { UseFormRegister } from "react-hook-form"
import { SwiperProps, SwiperSlide } from "swiper/react"
import Slider from "../slider"
import { GROUPLE_CONSTANTS } from "@/constants"
import Link from "next/link"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import "swiper/css/bundle"
import { GroupListItem } from "./list-item"

type Props = {
  overlay?: boolean
  label?: string
  register?: UseFormRegister<any>
  selected?: string
  route?: boolean
} & SwiperProps

const GroupListSlider = ({
  overlay,
  label,
  register,
  selected,
  route,
  ...rest
}: Props) => {
  return (
    <Slider
      slidesPerView={"auto"}
      spaceBetween={10}
      loop
      freeMode
      overlay={overlay}
      {...rest}
    >
      {GROUPLE_CONSTANTS.groupList.map((item, index) => (
        <SwiperSlide key={index} className="content-width-slide">
          {!register ? (
            route ? (
              <Link href={`/explore/${item.path}`}>
                <GroupListItem {...item} selected={selected} />
              </Link>
            ) : (
              <GroupListItem {...item} />
            )
          ) : (
            index > 0 && (
              <Label htmlFor={`item-${item.id}`}>
                <span>
                  <Input
                    id={`item-${item.id}`}
                    type="radio"
                    className="hidden"
                    value={item.path}
                    {...register("category")}
                  />
                  <GroupListItem {...item} selected={selected} />
                </span>
              </Label>
            )
          )}
        </SwiperSlide>
      ))}
    </Slider>
  )
}

export default GroupListSlider
