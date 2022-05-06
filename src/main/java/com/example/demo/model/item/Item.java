package com.example.demo.model.item;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;




@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name="Item")
@NamedNativeQueries({
        @NamedNativeQuery(
                name = "SimpleItemSliceByLocation",
                query = "SELECT Item.item_id, Item_Photo.item_photo_index, item_title, price, deposit, item_address, Item_Photo.item_photo, contract_status, create_date, " +
                        "EXISTS(SELECT item_id FROM Basket WHERE Basket.item_id = Item.item_id AND Basket.client_index = :client_index) AS is_like " +
                        "FROM Item LEFT JOIN Item_Photo " +
                        "ON Item.item_id = Item_Photo.item_id " +
                        "AND Item_Photo.is_main = 1 " +
                        "WHERE ST_Distance_Sphere(POINT(:client_longitude, :client_latitude), POINT(item_longitude, item_latitude)) <= 6000 " +
                        "GROUP BY item_id ORDER BY ST_Distance_Sphere(POINT(:client_longitude, :client_latitude), POINT(item_longitude, item_latitude)), Item.item_id",
                resultSetMapping = "SimpleItemMapping"
        ),
        @NamedNativeQuery(
                name = "ItemOwnerByOwnerId",
                query = "SELECT owner_id, item_title, price, deposit, item_address, contract_status, create_date, is_main, item_photo, Item.item_id " +
                        "FROM Item " +
                        "INNER JOIN Item_Photo " +
                        "ON Item_Photo.item_id = Item.item_id " +
                        "WHERE owner_id=:owner_id AND is_main=1" +
                        " ORDER BY Item.create_date DESC",
                resultSetMapping = "ItemOwnerDTOMapping"
        )
})
@SqlResultSetMapping(
        name = "SimpleItemMapping",
        classes = @ConstructorResult(
                targetClass = SimpleItem.class,
                columns = {
                        @ColumnResult(name = "item_id", type = Integer.class),
                        @ColumnResult(name = "item_photo_index", type = Integer.class),
                        @ColumnResult(name = "item_title", type = String.class),
                        @ColumnResult(name = "item_address", type = String.class),
                        @ColumnResult(name = "price", type = Integer.class),
                        @ColumnResult(name = "deposit", type = Integer.class),
                        @ColumnResult(name = "item_photo", type = String.class),
                        @ColumnResult(name = "contract_status", type = String.class),
                        @ColumnResult(name = "create_date", type = LocalDate.class),
                        @ColumnResult(name = "is_like", type = Boolean.class)
                }
        )
)
@SqlResultSetMapping(
        name = "ItemOwnerDTOMapping",
        classes = @ConstructorResult(
                targetClass = ItemOwnerResponseDTO.class,
                columns = {
                        @ColumnResult(name = "owner_id", type = Integer.class),
                        @ColumnResult(name = "item_title", type = String.class),
                        @ColumnResult(name = "price", type = Integer.class),
                        @ColumnResult(name = "deposit", type = Integer.class),
                        @ColumnResult(name = "item_address", type = String.class),
                        @ColumnResult(name = "contract_status", type = int.class),
                        @ColumnResult(name = "create_date", type = LocalDate.class),
                        @ColumnResult(name = "is_main", type = Boolean.class),
                        @ColumnResult(name = "item_photo", type = String.class),
                        @ColumnResult(name = "item_id", type = Integer.class)
                }
        )
)
public class Item extends BaseEntity{

    @Id
    @Column(name = "item_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer itemId;
    @Column(name = "owner_id")
    private Integer ownerId;
    @Column(name = "category_big")
    private int categoryBig;
    @Column(name = "category_middle")
    private int categoryMiddle;
    @Column(name = "category_small")
    private int categorySmall;
    @Column(name = "item_title")
    private String itemTitle;
    @Column(name = "item_content")
    private String itemContent;
    @Column(name = "item_quality")
    @Enumerated(EnumType.ORDINAL)
    private ItemQuality itemQuality;
    @Column(name = "contract_status")
    private int contractStatus;
    @Column
    private int price;
    @Column
    private int deposit;
    @Column(name = "start_date")
    private Date startDate;
    @Column(name = "end_date")
    private Date endDate;
    @Column(name = "item_latitude")
    private double itemLatitude;
    @Column(name = "item_longitude")
    private double itemLongitude;
    @Column(name = "item_address")
    private String itemAddress;
    @Column
    private int views;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "item_id")
    @Builder.Default
    private List<ItemPhoto> photos = new ArrayList<ItemPhoto>();

}