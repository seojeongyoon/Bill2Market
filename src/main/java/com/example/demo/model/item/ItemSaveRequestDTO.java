package com.example.demo.model.item;

import lombok.Data;
import org.springframework.data.geo.Point;

import java.util.Date;


@Data
public class ItemSaveRequestDTO {

    private String categoryBig;
    private String categoryMiddle;
    private String categorySmall;
    private String itemTitle;
    private String itemContent;
    private String itemQuality;
    private int price;
    private int deposit;
    private String itemAddress;
    private double itemLatitude;
    private double itemLongitude;
    private Integer ownerId;
    private Date startDate;
    private Date endDate;
    private ContractStatus contractStatus;


    public Item toEntity(Point point){
        return Item.builder()
                .itemLongitude(point.getX())
                .itemLatitude(point.getY())
                .ownerId(ownerId)
                .itemTitle(itemTitle)
                .categoryBig(categoryBig)
                .categoryMiddle(categoryMiddle)
                .categorySmall(categorySmall)
                .itemContent(itemContent)
                .itemQuality(itemQuality)
                .price(price)
                .deposit(deposit)
                .itemAddress(itemAddress)
                .views(0)
                .contractStatus(contractStatus)
                .build();
    }
}
